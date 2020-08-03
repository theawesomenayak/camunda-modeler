/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React, { PureComponent } from 'react';

import classNames from 'classnames';

import { Modal } from '../../../app/primitives';

import Input from './Input';

import css from './CatalogView.less';

import {
  isDefined,
  isNil
} from 'min-dash';

class CatalogView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      elementTemplates: [],
      filter: {
        catalogs: [],
        search: ''
      },
      selected: null
    };
  }

  componentDidMount = () => {
    this.getElementTemplates();
  }

  getElementTemplates = async () => {
    const {
      config,
      triggerAction
    } = this.props;

    let elementTemplates = await config.get('bpmn.elementTemplates');

    const selectedElementType = await triggerAction('getSelectedElementType');

    elementTemplates = elementTemplates.filter(({ appliesTo }) => {
      return appliesTo.includes(selectedElementType);
    });

    this.setState({
      elementTemplates
    });
  }

  onSelect = ({ id }) => {
    this.setState({
      selected: id
    });
  }

  onApply = () => {
    const {
      onApply,
      onClose
    } = this.props;

    const {
      elementTemplates,
      selected
    } = this.state;

    if (isNil(selected)) {
      return;
    }

    const elementTemplate = elementTemplates.find(({ id }) => id === selected);

    onApply(elementTemplate);

    onClose();
  }

  onSearchChange = search => {
    const { filter } = this.state;

    this.setState({
      filter: {
        ...filter,
        search
      }
    });
  }

  onCatalogsChange = catalogs => {
    const { filter } = this.state;

    this.setState({
      filter: {
        ...filter,
        catalogs
      }
    });
  }

  render() {
    const { onClose } = this.props;

    const {
      elementTemplates,
      filter,
      selected
    } = this.state;

    const {
      catalogs
    } = filter;

    const catalogNames = getCatalogNames(elementTemplates);

    return (
      <Modal className={ css.CatalogView } onClose={ onClose }>

        <Modal.Title>Catalog</Modal.Title>

        <Modal.Body>
          <div className="catalog__header">
            <h2 className="catalog__title">Templates</h2>
            <Input className="catalog__search" value={ filter.search } onChange={ this.onSearchChange } />
            <Dropdown className="catalog__catalogs" items={ catalogNames } checked={ catalogs } />
          </div>

          <ul className="catalog__body">
            {
              filterElementTemplates(elementTemplates, filter).map(elementTemplate => {
                const {
                  description,
                  id,
                  name
                } = elementTemplate;

                const catalogName = getCatalogName(elementTemplate);

                return (
                  <li className={
                    classNames(
                      'catalog-item',
                      { 'catalog-item--selected': id === selected }
                    )
                  } key={ id } onClick={ () => this.onSelect(elementTemplate) }>
                    <div className="catalog-item__header">
                      <span className="catalog-item__name">{ name }</span>
                      {
                        catalogName && <span className="catalog-item__catalog-name">{ catalogName }</span>
                      }
                    </div>
                    {
                      isDefined(description) && (
                        <div className="catalog-item__description">{ description }</div>
                      )
                    }
                  </li>
                );
              })
            }
          </ul>
        </Modal.Body>

        <Modal.Footer>
          <div className="form-submit">
            <button className="btn btn-secondary" type="submit" onClick={ onClose }>
              Cancel
            </button>
            {
              true && (
                <button disabled={ isNil(selected) } className="btn btn-primary" type="submit" onClick={ this.onApply }>
                  Apply
                </button>
              )
            }
          </div>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default CatalogView;

// helpers //////////

function filterElementTemplates(elementTemplates, filter) {
  return elementTemplates.filter(elementTemplate => {
    const {
      catalogs,
      search
    } = filter;

    const catalogName = getCatalogName(elementTemplate);

    if (catalogs && catalogs.length && !catalogs.includes(catalogName)) {
      return false;
    }

    if (search && search.length && !elementTemplate.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    return true;
  });
}

function getCatalogName(elementTemplate) {
  const { metadata } = elementTemplate;

  if (!metadata) {
    return;
  }

  const { tags } = metadata;

  if (!tags || !tags.length) {
    return;
  }

  return tags[ 0 ];
}

function getCatalogNames(elementTemplates) {
  return elementTemplates.reduce((catalogNames, elementTemplate) => {
    const catalogName = getCatalogName(elementTemplate);

    if (catalogName && !catalogNames.includes(catalogName)) {
      catalogNames = [
        ...catalogNames,
        catalogName
      ];
    }

    return catalogNames;
  }, []);
}
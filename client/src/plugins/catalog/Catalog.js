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

import Fill from '../../app/slot-fill/Fill';

import Button from '../../app/primitives/Button';

import CatalogView from './components/CatalogView';

import additionalModule from './modeler';

export default class Catalog extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: null,
      showModal: false
    };
  }

  async componentDidMount() {
    const { subscribe } = this.props;

    this.subscriptions = [
      subscribe('app.activeTabChanged', (...args) => this.handleActiveTabChanged(...args)),
      subscribe('bpmn.modeler.configure', (...args) => this.handleBpmnModelerConfigure(...args))
    ];
  }

  componentWillUnmount() {
    if (this.subscriptions && this.subscriptions.length) {
      this.subscriptions.forEach(subscription => subscription.cancel());
    }
  }

  handleActiveTabChanged = ({ activeTab }) => {
    this.setState({ activeTab });
  }

  handleBpmnModelerConfigure = async ({ middlewares }) => {
    middlewares.push(config => {
      return {
        ...config,
        additionalModules: [
          ...config.additionalModules,
          additionalModule
        ]
      };
    });
  }

  onApply = elementTemplate => {
    const { triggerAction } = this.props;

    const { activeTab } = this.state;

    if (!activeTab || activeTab.type !== 'bpmn') {
      return;
    }

    triggerAction('applyElementTemplate', elementTemplate);
  }

  onOpen = () => {
    this.setState({
      showModal: true
    });
  }

  onClose = () => {
    this.setState({
      showModal: false
    });
  }

  render() {
    const { showModal } = this.state;

    return <React.Fragment>
      <Fill slot="toolbar">
        <Button onClick={ this.onOpen }>Catalog</Button>
      </Fill>
      { showModal &&
        <CatalogView
          onClose={ this.onClose }
          onApply={ this.onApply }
          { ...this.props } />
      }
    </React.Fragment>;
  }
}

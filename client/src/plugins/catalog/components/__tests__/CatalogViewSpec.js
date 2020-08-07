/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React from 'react';

import { mount } from 'enzyme';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import CatalogView, { CatalogItem } from '../CatalogView';

chai.should();
chai.use(sinonChai);



describe.only('<CatalogView>', function() {

  describe('basics', function() {

    it('should render', async function() {

      // when
      const {
        instance,
        wrapper
      } = await createCatalogView();

      // then
      expect(instance).to.exist;
      expect(wrapper).to.exist;
    });


    it('should get element templates on mount', async function() {

      // given
      const { instance } = await createCatalogView();

      const getElementTemplatesSpy = sinon.spy(instance, 'getElementTemplates');

      // when
      instance.componentDidMount();

      // then
      expect(getElementTemplatesSpy).to.have.been.called;
    });


    it('should get element templates for selected element type', async function() {

      // given
      function triggerAction(action) {
        if (action === 'getSelectedElementType') {
          return 'bpmn:ServiceTask';
        }
      }

      const {
        instance,
        wrapper
      } = await createCatalogView({
        triggerAction
      });

      // when
      await instance.getElementTemplates();

      wrapper.update();

      // then
      expect(wrapper.state('elementTemplates')).to.have.length(2);
    });


    it.only('should select element template', async function() {

      // given
      const {
        instance,
        wrapper
      } = await createCatalogView();

      const entry = wrapper.find(CatalogItem).first();

      // when
      entry.simulate('click');

      // then
      expect(wrapper.state('selected')).to.equal('some-rpa-template');
    });


    it('should toggle expanded (expand)');


    it('should toggle expanded (collapse)');


    it('should apply element template');


    describe('filter', function() {

      it('should filter by search');


      it('should filter by catalog');

    });

  });

});

// helpers //////////

const DEFAULT_ELEMENT_TEMPLATES = [
  {
    appliesTo: [
      'bpmn:ServiceTask'
    ],
    id: 'some-rpa-template',
    metadata: {
      catalogOrganizationId: '00000000-0000-0000-0000-000000000000',
      catalogTemplateId: '00000000-0000-0000-0000-000000000000',
      created: 1000000000000,
      tags: [
        'Walt\'s Catalog'
      ],
      updated: 1000000000000
    },
    name: 'Template 1',
    properties: []
  },
  {
    appliesTo: [
      'bpmn:ServiceTask'
    ],
    id: 'another-rpa-template',
    metadata: {
      catalogOrganizationId: '00000000-0000-0000-0000-000000000000',
      catalogTemplateId: '00000000-0000-0000-0000-000000000001',
      created: 1000000000000,
      tags: [
        'Donald\'s Catalog'
      ],
      updated: 1000000000000
    },
    name: 'Template 2',
    properties: []
  },
  {
    appliesTo: [
      'bpmn:UserTask'
    ],
    id: 'user-task-template',
    metadata: {
      catalogOrganizationId: '00000000-0000-0000-0000-000000000000',
      catalogTemplateId: '00000000-0000-0000-0000-000000000002',
      created: 1000000000000,
      tags: [
        'Donald\'s Catalog'
      ],
      updated: 1000000000000
    },
    name: 'Template 3',
    properties: []
  }
];

async function createCatalogView(props = {}) {
  const defaultProps = {
    config: new Config(),
    displayNotification() {},
    onApply() {},
    onClose() {},
    subscribe() {},
    triggerAction() {}
  };

  const wrapper = mount(<CatalogView { ...{ ...defaultProps, ...props } } />);

  const instance = wrapper.instance();

  return {
    instance,
    wrapper
  };
}

class Config {
  constructor() {
    this.elementTemplates = DEFAULT_ELEMENT_TEMPLATES;
  }

  get(key, ...args) {
    if (key === 'bpmn.elementTemplates') {
      return Promise.resolve(this.elementTemplates);
    }

    throw Error('Unknown key');
  }
}

function createSubscribe(event) {
  let callback = null;

  function subscribe(_event, _callback) {
    if (event === _event) {
      callback = _callback;
    }

    return function cancel() {
      callback = null;
    };
  }

  function callSubscriber(...args) {
    if (callback) {
      callback(...args);
    }
  }

  return {
    callSubscriber,
    subscribe
  };
}
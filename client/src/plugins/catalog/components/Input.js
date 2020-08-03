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

import css from './Input.less';

export default class Input extends PureComponent {
  onChange = event => {
    const { onChange } = this.props;

    onChange(event.target.value);
  }

  onClear = () => {
    const { onChange } = this.props;

    onChange('');
  }

  render() {
    const {
      className,
      placeholder,
      value
    } = this.props;

    return (
      <div className={ classNames(css.Input, className) }>
        <input
          className="input__text"
          type="text"
          value={ value }
          placeholder={ placeholder || 'Type to search...' }
          onChange={ this.onChange } />
        {
          value && value.length && (
            <button className="input__clear" onClick={ this.onClear }>
            </button>
          )
        }
      </div>
    );
  }
}
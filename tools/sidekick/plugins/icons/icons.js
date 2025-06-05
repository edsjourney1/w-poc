/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// eslint-disable-next-line import/no-unresolved
import { PLUGIN_EVENTS } from 'https://main--franklin-library-host--dylandepass.hlx.live/tools/sidekick/library/events/events.js';

const selectedTags = [];

function getFilteredIcons(data, query) {
  if (!query) {
    return data;
  }

  return data.filter((item) => item.tag.toLowerCase().includes(query.toLowerCase()));
}

export async function decorate(container, data, query) {
  const createMenuItems = () => {
    const filteredIcons = getFilteredIcons(data, query);
    return filteredIcons
      .map((item) => {
        const isSelected = selectedTags.includes(item.icon);
        return `
        <sp-menu-item value='${item.code}' ${isSelected ? 'selected' : ''}>
            <sp-icon size='s'>
              ${item.svg}
            </sp-icon>
          ${item.icon}&nbsp;&nbsp;&nbsp;${item.code}
        </sp-menu-item>
      `;
      })
      .join('');
  };
  // <span style="display:inline-flex; margin-left: 25px">${item.code}</span>

  const handleMenuItemClick = (e) => {
    const { value } = e.target;
    navigator.clipboard.writeText(value);
    container.dispatchEvent(
      new CustomEvent(PLUGIN_EVENTS.TOAST, {
        detail: { message: 'Copied Icon Code' },
      }),
    );
  };

  const menuItems = createMenuItems();
  const sp = /* html */ `
    <sp-menu
      label='Select Icon'
      data-testid='taxonomy'
      style="display: flex; flex-wrap: wrap"
    >
      ${menuItems}
    </sp-menu>
  `;

  const spContainer = document.createElement('div');
  spContainer.classList.add('container');
  spContainer.innerHTML = sp;
  container.append(spContainer);

  const menuItemElements = spContainer.querySelectorAll('sp-menu-item');
  menuItemElements.forEach((item) => {
    item.addEventListener('click', handleMenuItemClick);
  });

  // const copyButton = spContainer.querySelector('sp-action-button');
  // copyButton.addEventListener('click', handleCopyButtonClick);
}

export default {
  title: 'Icons',
  searchEnabled: true,
};

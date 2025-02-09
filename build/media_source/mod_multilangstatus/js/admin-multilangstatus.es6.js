/**
 * @copyright  (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // We need to use JS to move the modal before the closing body tag to avoid stacking issues
    const multilangueModal = document.getElementById('multiLangModal');

    if (multilangueModal) {
      // Clone the modal element
      const clone = multilangueModal.cloneNode(true);

      // Remove the original modal element
      multilangueModal.parentNode.removeChild(multilangueModal);

      // Append clone before closing body tag
      document.body.appendChild(clone);

      // Modal was moved so it needs to be re initialised
      Joomla.initialiseModal(clone);
    }
  });
})();

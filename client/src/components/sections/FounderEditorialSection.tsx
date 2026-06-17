/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import FounderEditorialContent from './FounderEditorialContent';

const BRIGHT_BG = '#FDF8F0';
const TEXT = '#2B2B2B';

export default function FounderEditorialSection() {
  return (
    <section
      id="founder-story"
      className="relative w-full overflow-hidden pt-16 md:pt-24 lg:pt-28"
      style={{ backgroundColor: BRIGHT_BG, color: TEXT }}
    >
      <div className="px-6 md:px-12 pb-4 md:pb-6">
        <FounderEditorialContent />
      </div>
    </section>
  );
}

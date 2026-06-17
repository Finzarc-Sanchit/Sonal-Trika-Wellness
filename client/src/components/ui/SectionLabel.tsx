/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface SectionLabelProps {
  children: string;
  dotColor?: string;
}

export default function SectionLabel({
  children,
  dotColor = '#7A8B6F',
}: SectionLabelProps) {
  return (
    <div className="inline-flex items-center gap-2.5 mb-5">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: dotColor }}
      />
      <span className="font-sans text-caption font-medium tracking-tight text-[#888888] uppercase">
        {children}
      </span>
    </div>
  );
}

export type Feature = { title: string; description: string };
export type License = { name: string; price: number; group?: string; recommended?: boolean };
export type Product = {
  id: string;
  name: string;
  shortName: string;
  category: 'enhancements' | 'hwid';
  categoryLabel: string;
  art: 'private' | 'slotted' | 'colorbot' | 'permanent' | 'temporary';
  badge?: string;
  tagline: string;
  description: string;
  chips: string[];
  features: Feature[];
  extraFeatures?: { title: string; items: Feature[] };
  compatibility: string[];
  licenses: License[];
  status: 'Undetected';
};

// Product information, prices, and published statuses supplied by Goblin Services.
// These are owner-published values, not independent detection or availability checks.
export const products: Product[] = [
  {
    id: 'fortnite-private', name: 'Fortnite Private', shortName: 'Private', category: 'enhancements',
    categoryLabel: 'FORTNITE', art: 'private', badge: 'FULLY CUSTOMIZABLE',
    tagline: 'Your game. Your rules.',
    description: 'A premium experience built around you. Customizable features, optimized performance, and support that has your back.',
    chips: ['Customizable features', 'Low FPS impact'],
    features: [
      { title: 'Dedicated support', description: 'Fast and reliable assistance when you need it.' },
      { title: 'Customizable settings', description: 'Adjust aimbot, visuals, and more to your preferences.' },
      { title: 'Security-focused', description: 'Designed with stability in mind.' },
      { title: 'Easy setup', description: 'Fast delivery and a straightforward installation.' },
      { title: 'Flexible playstyles', description: 'Fine-tune your settings to suit the way you play.' },
      { title: 'Optimized performance', description: 'Designed for minimal impact on your FPS.' },
      { title: 'Automatic updates', description: 'Regular maintenance and improvements included.' },
      { title: 'Intel & AMD support', description: 'Compatible with both processor platforms.' },
    ],
    compatibility: ['Intel processors', 'AMD processors'],
    licenses: [
      { name: '3-day license', price: 14.99 }, { name: '1-week license', price: 19.99 },
      { name: '1-month license', price: 39.99, recommended: true }, { name: '1 month + 1 month TEMP', price: 49.99 },
      { name: '3-month license', price: 99.99 }, { name: '6-month license', price: 149.99 },
      { name: 'Lifetime + lifetime PERM', price: 169.99 },
    ], status: 'Undetected',
  },
  {
    id: 'fortnite-slotted', name: 'Fortnite Slotted', shortName: 'Slotted', category: 'enhancements',
    categoryLabel: 'FORTNITE', art: 'slotted', badge: 'LIMITED SLOTS',
    tagline: 'Exclusive by design.',
    description: 'Private-level features with limited access. An exclusive experience with powerful customization and carefully controlled distribution.',
    chips: ['Limited access', 'Cloud-based loader'],
    features: [
      { title: 'Limited slots', description: 'Exclusive access with restricted availability.' },
      { title: 'Private-level experience', description: 'Premium features at an accessible price.' },
      { title: 'Customizable settings', description: 'Adjust aimbot, visuals, and more.' },
      { title: 'Proven technology', description: 'Used by 500+ players, as reported by Goblin Services.' },
      { title: 'Fast setup', description: 'Quick delivery and simple installation.' },
      { title: 'Dedicated maintenance', description: 'Regular improvements and reliable support.' },
    ],
    extraFeatures: { title: 'Security & optimization', items: [
      { title: 'Cloud-based loader', description: 'Simple, convenient access to your software.' },
      { title: 'Limited user capacity', description: 'Controlled distribution for an exclusive experience.' },
      { title: 'Optimized performance', description: 'Designed for minimal FPS impact.' },
      { title: 'Automatic updates', description: 'Ongoing maintenance included with your license.' },
    ] },
    compatibility: [],
    licenses: [{ name: '1-week license', price: 29.99 }, { name: '1-month license', price: 69.99, recommended: true }, { name: '3-month license', price: 129.99 }],
    status: 'Undetected',
  },
  {
    id: 'colorbot', name: 'Valorant ColorBot', shortName: 'ColorBot', category: 'enhancements',
    categoryLabel: 'COLOR-BASED AIM ASSIST', art: 'colorbot',
    tagline: 'Precision, in full color.',
    description: 'Screen-based color targeting, built for simplicity. A clean interface and flexible controls put your preferences first.',
    chips: ['Screen-based detection', 'Custom keybinds'],
    features: [
      { title: 'Color-based targeting', description: 'Detects your selected target color on screen.' },
      { title: 'Custom target color', description: 'Choose and adjust the color to your preferences.' },
      { title: 'Custom keybinds', description: 'Set your own shoot and hold keys.' },
      { title: 'Legit settings', description: 'Additional options for your preferred playstyle.' },
      { title: 'Easy controls', description: 'Enable or disable ColorBot instantly.' },
      { title: 'Clean interface', description: 'A simple, modern, easy-to-use menu.' },
      { title: 'No memory reading', description: 'Does not read or scan game memory.' },
      { title: 'No memory writing', description: 'Does not modify in-game memory values.' },
      { title: 'External operation', description: 'Works through screen-based color detection.' },
      { title: 'No code injection', description: 'Does not inject code into the game process.' },
      { title: 'No game file modifications', description: 'Leaves original game files unchanged.' },
    ], compatibility: [],
    licenses: [{ name: '3-day license', price: 9.99 }, { name: '1-week license', price: 14.99 }, { name: '1-month license', price: 29.99, recommended: true }, { name: 'Lifetime license', price: 79.99 }],
    status: 'Undetected',
  },
  {
    id: 'permanent', name: 'Permanent Spoofer', shortName: 'Permanent', category: 'hwid',
    categoryLabel: 'HWID VIRTUALIZATION', art: 'permanent',
    tagline: 'A fresh start. Built to last.',
    description: 'Advanced kernel-level hardware ID management. Flexible modes, comprehensive coverage, and lifetime access options.',
    chips: ['Kernel-level', 'Lifetime options'],
    features: [
      { title: 'Kernel-level spoofing', description: 'Advanced hardware ID virtualization.' },
      { title: 'Full HWID support', description: 'DISK, SMBIOS, GPU, SID, MONITOR, PERIPHERALS + USB, ARP, MAC, NIC, and more.' },
      { title: 'Flexible modes', description: 'Choose between revert and persistent options.' },
      { title: 'Trace cleaner', description: 'Log and hardware history cleanup.' },
      { title: 'Fortnite cleaner', description: 'Windows reinstallation is not required.' },
      { title: 'Advanced system', description: 'EFI, driver, and seeding support.' },
      { title: 'No RAID0 required', description: 'A straightforward setup process.' },
    ],
    compatibility: ['Windows 10 & 11', '22H2 / 24H2 / 25H2', 'Intel & AMD', 'All motherboard brands', 'ASUS · MSI · Gigabyte · Dell · HP · Acer'],
    licenses: [
      { name: 'Without TPM', price: 19.99, group: 'One-time usage' },
      { name: 'With TPM', price: 29.99, group: 'One-time usage' },
      { name: 'Without TPM', price: 39.99, group: 'Lifetime usage', recommended: true },
      { name: 'With TPM', price: 49.99, group: 'Lifetime usage' },
    ], status: 'Undetected',
  },
  {
    id: 'temporary', name: 'Temporary Spoofer', shortName: 'Temporary', category: 'hwid',
    categoryLabel: 'HWID SPOOFING', art: 'temporary',
    tagline: 'One click. A clean slate.',
    description: 'Fast, temporary HWID changes with a simple interface. Flexible licenses, broad compatibility, and built-in cleaning tools.',
    chips: ['One-click setup', 'Intel & AMD'],
    features: [
      { title: 'One-click spoofing', description: 'Fast temporary hardware ID changes.' },
      { title: 'Full HWID coverage', description: 'Disk, BIOS, MAC, and more.' },
      { title: 'Game support', description: 'Fortnite, Call of Duty, Apex, and more.' },
      { title: 'Built-in cleaners', description: 'Integrated Fortnite cleaning tools.' },
      { title: 'Easy setup', description: 'Simple interface and fast delivery.' },
      { title: 'Flexible access', description: 'Choose the license that suits your needs.' },
    ],
    compatibility: ['Windows 10 & 11', 'Intel & AMD', 'EAC · BE · RICO'],
    licenses: [{ name: '1-day license', price: 4.99 }, { name: '3-day license', price: 11.99 }, { name: '1-week license', price: 19.99 }, { name: '1-month license', price: 49.99, recommended: true }, { name: 'Lifetime license', price: 109.99 }],
    status: 'Undetected',
  },
];

export const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

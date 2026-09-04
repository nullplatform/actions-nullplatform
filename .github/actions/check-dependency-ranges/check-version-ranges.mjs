// Fails when package.json declares dependency ranges with no upper bound.
// An uncapped range silently adopts future majors, breaking changes included:
// a ">=" security override can float a transitive dependency onto an ESM-only
// major and break a CommonJS consumer at runtime, with CI still green.
import { readFileSync } from 'fs';

// peerDependencies are deliberately NOT checked: open-ended peer ranges are a
// legitimate library convention — the consumer's own dependency range bounds them.
const DEPENDENCY_SECTIONS = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'overrides',
];

// Specifiers that are not semver ranges (git URLs, local paths, workspace and
// catalog protocols) are skipped — the check only judges registry version ranges.
const NON_RANGE_SPECIFIER = /^(file:|git|http|link:|workspace:|catalog:)/;

// An alternative is unbounded when nothing caps it from above: a bare "*",
// "x", "latest", or a ">"/">=" comparator with no "<"/"<=" companion.
const isUnboundedAlternative = (alternative) => {
  const trimmed = alternative.trim();
  if (trimmed === '' || trimmed === '*' || trimmed === 'x' || trimmed === 'latest') {
    return true;
  }
  if (trimmed.includes('>') && !trimmed.includes('<')) {
    return true;
  }
  return false;
};

const isUnboundedRange = (range) => {
  if (NON_RANGE_SPECIFIER.test(range)) {
    return false;
  }
  // npm: aliases delegate to the aliased range ("npm:package@^1.0.0")
  const effectiveRange = range.startsWith('npm:') ? range.slice(range.lastIndexOf('@') + 1) : range;
  return effectiveRange.split('||').some(isUnboundedAlternative);
};

export const findUnboundedRanges = (packageDefinition) => {
  const findings = [];
  const inspect = (section, entries) => {
    for (const [name, specifier] of Object.entries(entries)) {
      if (typeof specifier === 'object' && specifier !== null) {
        // overrides admit nested objects ({".": "...", child: "..."})
        inspect(`${section} > ${name}`, specifier);
      }
      if (typeof specifier === 'string' && isUnboundedRange(specifier)) {
        findings.push({ section, name, specifier });
      }
    }
  };
  for (const section of DEPENDENCY_SECTIONS) {
    if (packageDefinition[section]) {
      inspect(section, packageDefinition[section]);
    }
  }
  return findings;
};

const isMainModule = process.argv[1]?.endsWith('check-version-ranges.mjs');
if (isMainModule) {
  const packageJsonPath = process.argv[2] ?? 'package.json';
  const packageDefinition = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const findings = findUnboundedRanges(packageDefinition);
  if (findings.length > 0) {
    console.error('Unbounded version ranges are not allowed — an uncapped range adopts');
    console.error('future majors silently, including breaking ones: a ">=" override can');
    console.error('float a dependency onto an ESM-only major and break a CommonJS consumer.');
    for (const { section, name, specifier } of findings) {
      console.error(`  ${section}: "${name}": "${specifier}" — pin a ceiling (^, ~ or an exact version)`);
    }
    console.error('To bypass while fixing: pass check-dependency-ranges: false to the reusable workflow.');
    process.exit(1);
  }
  console.log('All dependency ranges have an upper bound.');
}

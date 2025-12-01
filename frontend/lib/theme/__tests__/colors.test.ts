import { colors, chartColors } from '../colors';

describe('colors', () => {
  it('exports neutral colors', () => {
    expect(colors.neutral).toBeDefined();
    expect(colors.neutral.white).toBe('#FFFFFF');
    expect(colors.neutral.gray900).toBeDefined();
  });

  it('exports primary colors', () => {
    expect(colors.primary).toBeDefined();
    expect(colors.primary.main).toBeDefined();
    expect(colors.primary.light).toBeDefined();
    expect(colors.primary.dark).toBeDefined();
  });

  it('exports accent colors', () => {
    expect(colors.accent).toBeDefined();
    expect(colors.accent.main).toBeDefined();
  });

  it('exports semantic colors', () => {
    expect(colors.success).toBeDefined();
    expect(colors.warning).toBeDefined();
    expect(colors.error).toBeDefined();
    expect(colors.info).toBeDefined();
  });

  it('exports chart colors', () => {
    expect(chartColors).toBeDefined();
    expect(chartColors.primary).toBeDefined();
    expect(chartColors.series1).toBeDefined();
  });
});


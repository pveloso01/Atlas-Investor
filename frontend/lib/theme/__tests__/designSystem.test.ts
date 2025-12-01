import { designSystem } from '../designSystem';

describe('designSystem', () => {
  it('exports colors', () => {
    expect(designSystem.colors).toBeDefined();
    expect(designSystem.colors.primary).toBeDefined();
    expect(designSystem.colors.neutral).toBeDefined();
  });

  it('exports typography configuration', () => {
    expect(designSystem.typography).toBeDefined();
    expect(designSystem.typography.fontFamily).toBeDefined();
    expect(designSystem.typography.fontSize).toBeDefined();
    expect(designSystem.typography.fontWeight).toBeDefined();
    expect(designSystem.typography.lineHeight).toBeDefined();
  });

  it('exports spacing scale', () => {
    expect(designSystem.spacing).toBeDefined();
    expect(designSystem.spacing.xs).toBeDefined();
    expect(designSystem.spacing.md).toBeDefined();
    expect(designSystem.spacing.xl).toBeDefined();
  });

  it('exports border radius values', () => {
    expect(designSystem.borderRadius).toBeDefined();
    expect(designSystem.borderRadius.sm).toBeDefined();
    expect(designSystem.borderRadius.md).toBeDefined();
    expect(designSystem.borderRadius.lg).toBeDefined();
  });

  it('exports shadow values', () => {
    expect(designSystem.shadows).toBeDefined();
    expect(designSystem.shadows.sm).toBeDefined();
    expect(designSystem.shadows.md).toBeDefined();
    expect(designSystem.shadows.lg).toBeDefined();
  });

  it('exports transition values', () => {
    expect(designSystem.transitions).toBeDefined();
    expect(designSystem.transitions.fast).toBeDefined();
    expect(designSystem.transitions.normal).toBeDefined();
    expect(designSystem.transitions.slow).toBeDefined();
  });

  it('exports z-index scale', () => {
    expect(designSystem.zIndex).toBeDefined();
    expect(designSystem.zIndex.modal).toBeDefined();
    expect(designSystem.zIndex.tooltip).toBeDefined();
  });

  it('exports breakpoints', () => {
    expect(designSystem.breakpoints).toBeDefined();
    expect(designSystem.breakpoints.sm).toBeDefined();
    expect(designSystem.breakpoints.md).toBeDefined();
    expect(designSystem.breakpoints.lg).toBeDefined();
  });
});


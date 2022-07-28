import { MaterialModule } from './material.module';

describe('MaterialModuleModule', () => {
  let materialModuleModule: MaterialModule;

  beforeEach(() => {
    materialModuleModule = new MaterialModule();
  });

  it('should create an instance', () => {
    expect(materialModuleModule).toBeTruthy();
  });
});

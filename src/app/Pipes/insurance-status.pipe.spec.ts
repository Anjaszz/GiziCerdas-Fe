import { InsuranceStatusPipe } from './insurance-status.pipe';

describe('InsuranceStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new InsuranceStatusPipe();
    expect(pipe).toBeTruthy();
  });
});

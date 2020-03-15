import { TestBed } from '@angular/core/testing';

import { DeckDataService } from './deck-data.service';

describe('DeckDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeckDataService = TestBed.get(DeckDataService);
    expect(service).toBeTruthy();
  });
});

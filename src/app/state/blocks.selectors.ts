import { createSelector, createFeatureSelector } from '@ngrx/store';
import { blocksState } from './blocks.reducer';
import * as blocks from 'src/app/models/blocks.model';
 
export const selectBlocks = createFeatureSelector<blocksState>('blocks');
export const getWeeksByYear = createSelector(
    selectBlocks,
    (state: blocksState) => state.weeksByYear
);

export const getWeeksByYear$ = (year: number) =>
    createSelector(getWeeksByYear, (weeksByYear: blocks.weeksByYear) => {
        return weeksByYear[year];
});
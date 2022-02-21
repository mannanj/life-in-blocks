import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as blocks from 'src/app/models/blocks.model';
 
export const selectBlocksState = createFeatureSelector<blocks.blocksState>('blocks');
export const getYears = createSelector(
    selectBlocksState,
    (state: blocks.blocksState) => state.years
);

export const getYear$ = (year: number) =>
    createSelector(getYears, (years: blocks.years) => {
        return years[year];
});

export const getYearsLoading$ = createSelector(
    selectBlocksState,
    (state: blocks.blocksState) => state.yearsLoading
);

export const getIsEditing$ = createSelector(
    selectBlocksState,
    (state: blocks.blocksState) => state.isEditing
);
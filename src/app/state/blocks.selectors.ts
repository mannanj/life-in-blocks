import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as blocks from 'src/app/models/blocks.model';
 
export const selectBlocksState = createFeatureSelector<blocks.blocksState>('blocks');
export const getWeeksByYear$ = createSelector(
    selectBlocksState,
    (state: blocks.blocksState) => state.weeksByYear
);

export const getWeeksForYear$ = (year: number) =>
    createSelector(getWeeksByYear$, (weeksByYear: blocks.weeksByYear) => {
        return weeksByYear[year];
});

export const getIsLoading$ = createSelector(
    selectBlocksState,
    (state: blocks.blocksState) => state.isLoading
);

export const getIsEditing$ = createSelector(
    selectBlocksState,
    (state: blocks.blocksState) => state.isEditing
);
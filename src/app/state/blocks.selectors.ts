import { createSelector, createFeatureSelector } from '@ngrx/store';
import { blocksState } from './blocks.reducer';
import * as blocks from 'src/app/models/blocks.model';
 
export const selectBlocksState = createFeatureSelector<blocksState>('blocks');
export const getWeeksByYear$ = createSelector(
    selectBlocksState,
    (state: blocksState) => state.weeksByYear
);

export const getWeeksForYear$ = (year: number) =>
    createSelector(getWeeksByYear$, (weeksByYear: blocks.weeksByYear) => {
        return weeksByYear[year];
});

export const getZoomLevel$ = createSelector(
    selectBlocksState,
    (state: blocksState) => state.zoom.zoomLevel
);

export const getIsLoading$ = createSelector(
    selectBlocksState,
    (state: blocksState) => state.isLoading
);

export const getIsEditing$ = createSelector(
    selectBlocksState,
    (state: blocksState) => state.isEditing
);
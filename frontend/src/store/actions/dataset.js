import { replace } from 'lodash'
import moment from 'moment'

import api from '../../api/api'

/**
 * Types
 */

export const SET_ACTIVE_DATASET_ID = 'SET_ACTIVE_DATASET_ID'
export const CLEAR_ACTIVE_DATASET_ID = 'CLEAR_ACTIVE_DATASET_ID'
export const SET_DATASET_COMPARE_IDS = 'SET_DATASET_COMPARE_IDS'
export const CLEAR_DATASET_COMPARE_IDS = 'CLEAR_DATASET_COMPARE_IDS'
export const CREATE_DATASET = 'CREATE_DATASET'
export const SET_DATASETS = 'SET_DATASETS'

/**
 * Action creators
 */

export const setActiveDatasetId = activeDatasetId => ({
  type: SET_ACTIVE_DATASET_ID,
  payload: { activeDatasetId },
})

export const clearActiveDatasetId = () => ({
  type: CLEAR_ACTIVE_DATASET_ID,
})

export const setDatasetsToCompareIds = datasetsToCompareIds => ({
  type: SET_DATASET_COMPARE_IDS,
  payload: { datasetsToCompareIds },
})

export const clearDatasetsToCompareIds = () => ({
  type: CLEAR_DATASET_COMPARE_IDS,
})

export const createDataset = dataset => ({
  type: CREATE_DATASET,
  payload: { dataset },
})

export const setDatasets = datasets => ({
  type: SET_DATASETS,
  payload: { datasets },
})

/**
 * Action dispatchers
 */

export const getDatasetsDispatcher = dispatch => async () => {
  const response = await api.getDatasets()

  if (response.status === 200) {
    dispatch(setDatasets(response.data))
  }
}

export const setActiveDatasetIdDispatcher = dispatch => activeDatasetId => {
  dispatch(setActiveDatasetId(activeDatasetId))
}

export const clearActiveDatasetIdDispatcher = dispatch => async id => {
  const response = await api.terminateDataset(id)

  if (response.status === 200) {
    dispatch(clearActiveDatasetId())
  }
}

export const setDatasetsToCompareIdsDispatcher = dispatch => datasetsToCompareIds => {
  dispatch(setDatasetsToCompareIds(datasetsToCompareIds))
}

export const clearDatasetsToCompareIdsDispatcher = dispatch => () => {
  dispatch(clearDatasetsToCompareIds())
}

export const createDatasetDispatcher = dispatch => async (dataset, setAsActive = false) => {
  const datasetToCreate = {
    ...dataset,
    name: replace(dataset.name, ' ', '_'),
    datasetEnd: moment(dataset.endDate).unix(),
    datasetInterval: dataset.interval * 1000,
  }

  if (setAsActive) {
    datasetToCreate.status = 1
  }

  const response = await api.createDataset(datasetToCreate)

  if (response.status === 200) {
    dispatch(createDataset(response.data))

    if (setAsActive) {
      setActiveDatasetIdDispatcher(dispatch)(response.data.id)
    }
  }
}

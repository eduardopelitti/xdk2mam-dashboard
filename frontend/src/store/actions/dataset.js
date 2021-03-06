import { replace } from 'lodash'

import api from '../../api/api'

/**
 * Types
 */

export const SET_ACTIVE_DATASET_ID = 'SET_ACTIVE_DATASET_ID'
export const CLEAR_ACTIVE_DATASET_ID = 'CLEAR_ACTIVE_DATASET_ID'
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

export const createDatasetDispatcher = dispatch => async (dataset, setAsActive = false) => {
  const datasetToCreate = {
    ...dataset,
    name: replace(dataset.name, ' ', '_'),
    datasetEnd: dataset.endDate.unix(),
    datasetInterval: 30000 /** @todo This value shouldn't be hardcoded, perhaps env variable or sent as part of the dataset object */,
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

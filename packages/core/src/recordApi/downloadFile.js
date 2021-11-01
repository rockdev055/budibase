import { apiWrapper, events, isNothing } from "../common"
import { permission } from "../authApi/permissions"
import { safeGetFullFilePath } from "./uploadFile"
import { BadRequestError } from "../common/errors"
import { getRecordInfo } from "./recordInfo"

export const downloadFile = app => async (recordKey, relativePath) =>
  apiWrapper(
    app,
    events.recordApi.uploadFile,
    permission.readRecord.isAuthorized(recordKey),
    { recordKey, relativePath }, //remove dupe key 'recordKey' from object
    _downloadFile,
    app,
    recordKey,
    relativePath
  )

const _downloadFile = async (app, recordKey, relativePath) => {
  if (isNothing(recordKey)) {
    throw new BadRequestError("Record Key not supplied")
  }
  if (isNothing(relativePath)) {
    throw new BadRequestError("file path not supplied")
  }

  const { dir } = getRecordInfo(app.hierarchy, recordKey)
  return await app.datastore.readableFileStream(
    safeGetFullFilePath(dir, relativePath)
  )
}

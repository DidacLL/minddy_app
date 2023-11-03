import {i18n} from "@lingui/core";
import {t} from "@lingui/macro";

export enum TaskState {
    TODO,
    ON_PROGRESS,
    REVIEW,
    DEFERRED,
    DONE,
    DISCARDED
}
export const TaskStateName={
    [TaskState.TODO]:i18n._(t`Task To Do`),
    [TaskState.ON_PROGRESS]:i18n._(t`Task on progress`),
    [TaskState.REVIEW]:i18n._(t`Task Review`),
    [TaskState.DEFERRED]:i18n._(t`Task Deferred`),
    [TaskState.DONE]:i18n._(t`Task Done`),
    [TaskState.DISCARDED]:i18n._(t`Task Discarded`),
}
import {i18n} from "@lingui/core";
import {t} from "@lingui/macro";

export enum ProjectState {
    ACTIVE = 0,
    DELAYED = 1,
    PAUSED = 2,
    SILENT = 3,
    DISCARDED = 4,
    COMPLETE = 5
}

export const ProjectStateNames={
    [ProjectState.ACTIVE]: i18n._(t`Project Active`),
    [ProjectState.DELAYED]: i18n._(t`Project Delayed`),
    [ProjectState.PAUSED]: i18n._(t`Project Paused`),
    [ProjectState.SILENT]: i18n._(t`Project Silent`),
    [ProjectState.DISCARDED]: i18n._(t`Project Discarded`),
    [ProjectState.COMPLETE]: i18n._(t`Project Complete`),

}
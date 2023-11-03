import {i18n} from "@lingui/core";
import {t} from "@lingui/macro";

export enum Priority {
    LOWER,
    LOW,
    NORMAL,
    HIGH,
    HIGHER
}
export const PriorityNames={
    [Priority.LOWER]: i18n._(t`Lower Priority`),
    [Priority.LOW]: i18n._(t`Low Priority`),
    [Priority.NORMAL]: i18n._(t`Normal Priority`),
    [Priority.HIGH]: i18n._(t`High Priority`),
    [Priority.HIGHER]: i18n._(t`Higher Priority`)

}


import {i18n} from "@lingui/core";
import {t} from "@lingui/macro";

export enum DashboardTabs {
    DASHBOARD, TASKS, NOTES
}
export const DashboardTabsName={
    [DashboardTabs.DASHBOARD]: i18n._(t`Dashboard tab`),
    [DashboardTabs.TASKS]: i18n._(t`Tasks tab`),
    [DashboardTabs.NOTES]: i18n._(t`Notes tab`),
}
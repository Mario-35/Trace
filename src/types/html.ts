/**
 * HTML Element Interface
 *
 * @copyright 2026-present Inrae
 * @review 29-06-2026
 * @author mario.adam@inrae.fr
 *
 */

export interface IHTMLOptions {
    name: String;
    label: String;
    placeholder?: String;
    size?: Number;
    error?: boolean;
    readonly?: boolean;
    invisible?: boolean;
    disabled?: boolean;
    max?: Number;
    tooltip?: String;
    tooltipFlow?: String;
    canedit?: String;
    json?: String;
};

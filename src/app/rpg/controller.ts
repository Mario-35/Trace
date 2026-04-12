/**
 * Rpg controller
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { logger } from "@infra/logger";


/**
 * 
 * @param annee year of daerc
 * @param x ws84 lattitude position
 * @param y ws84 longiitude position
 * @returns JSON object with years and value code
 */
async function getRpgDatas(annee: number, x: string, y: string) {
    let url = 'https://apicarto.ign.fr/api/rpg/v';
    url += annee < 2015 ? '1' : '2'
    url += '?annee=' + annee +'&geom={"type": "Point", "coordinates": [' + x + ', ' + y + ']}'; 
	return fetch(encodeURI(url), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	}).then(async (response: any) => {
		return await response.json().then((res: any) => {
			try {
				return res["code"] === 400 ? "NOT" : res["features"][0]["properties"]["code_cultu"];				
			} catch (error) {
				return "NOT"
			}
		})

	}).catch((error: Error) => {
		logger.error(error);
	});
}

/**
 * 
 * @param x ws84 lattitude position
 * @param y ws84 longiitude position
 * @returns JSON object with years and value code
 */
export async function getRpg(x: string, y: string) {
    const results:Record<string, unknown> = {};
	const maxYear = new Date().getFullYear();
    for (let year = maxYear - 15; year <= maxYear; year++) {
		results[year] = await getRpgDatas(year, x, y) || "NOT";
    }
    return results;

};
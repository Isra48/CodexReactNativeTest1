/**
 * @typedef {Object} StrapiPagination
 * @property {number} page
 * @property {number} pageSize
 * @property {number} pageCount
 * @property {number} total
 */

/**
 * @typedef {Object} StrapiMeta
 * @property {{ pagination: StrapiPagination }} meta
 */

/**
 * @template T
 * @typedef {Object} StrapiResponse
 * @property {Array<{ id: string | number, attributes: T }>} data
 * @property {StrapiMeta} [meta]
 */

/**
 * @typedef {Object} StrapiImage
 * @property {string} url
 * @property {string} [alternativeText]
 * @property {number} [width]
 * @property {number} [height]
 */

/**
 * @typedef {Object} StrapiClassAttributes
 * @property {string} title
 * @property {string} [description]
 * @property {string} [category]
 * @property {string} [modality]
 * @property {string} [materials]
 * @property {string} [timezone]
 * @property {string} [startAt]
 * @property {string} [endAt]
 * @property {number} [durationMinutes]
 * @property {string} [zoomLink]
 * @property {boolean} [isFeatured]
 * @property {{ name?: string }} [instructor]
 * @property {{ data?: { attributes?: StrapiImage } }} [image]
 */

/**
 * @typedef {Object} AppClass
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {string} [category]
 * @property {string} [instructor]
 * @property {string} [date]
 * @property {string} [time]
 * @property {string} [modality]
 * @property {string} [materials]
 * @property {number} [durationMinutes]
 * @property {string} [startDateTime]
 * @property {string} [endDateTime]
 * @property {string} [timezone]
 * @property {string} [zoomLink]
 * @property {boolean} [isFeatured]
 * @property {string} [image]
 */

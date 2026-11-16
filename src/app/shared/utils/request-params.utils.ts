import { HttpParams } from '@angular/common/http';

type RequestParamPrimitive = string | number | boolean;
type RequestParamValue = RequestParamPrimitive | RequestParamPrimitive[];
type RequestParams = Record<string, RequestParamValue | null | undefined>;

/**
 * Preparing request parameters.
 * @param req
 * @returns
 */
export const prepareRequestParams = (req?: RequestParams): HttpParams => {
  let params = new HttpParams();

  if (!req) {
    return params;
  }

  Object.keys(req).forEach((key) => {
    const value = req[key];

    if (value == null) {
      return;
    }

    if (Array.isArray(value)) {
      const normalizedValues = value
        .map((arrayItem) => arrayItem.toString().trim())
        .filter((arrayItem) => arrayItem.length > 0);

      if (normalizedValues.length > 0) {
        params = params.set(key, normalizedValues.join(','));
      }
      return;
    }

    if (value.toString().length > 0) {
      params = params.set(key, value.toString());
    }
  });

  return params;
};

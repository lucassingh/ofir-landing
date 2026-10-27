"use client";

import { createContext, useContext } from "react";

/** true dentro de la vista previa del panel: el formulario se ve pero no envía. */
export const PreviewModeContext = createContext(false);

export function usePreviewMode() {
  return useContext(PreviewModeContext);
}

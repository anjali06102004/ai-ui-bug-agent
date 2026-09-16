export interface UIBug {
  type: string;
  severity: "low" | "medium" | "high";
  message: string;
  element?: string;
}

export interface PageData {
    url: string;
    title: string;
    links: string[];
    buttons: string[];
    inputs: number;
    headings: string[];
    screenshot: string;
    consoleErrors: string[];
    bugs: UIBug[];
}
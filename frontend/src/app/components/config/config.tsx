class ConfigApp {
    static URL_API: string = process.env.NEXT_PUBLIC_URL_API ?? "http://localhost:3001";
}

export default ConfigApp;
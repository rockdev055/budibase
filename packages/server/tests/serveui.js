const statusCodes = require("../utilities/statusCodes");
const { readFile } = require("fs-extra");

module.exports = (app) => {

    it("should serve unauthenticated index.html as default", async () => {
        const response = await app.get("/testApp")
                            .expect(statusCodes.OK);

        const expectedIndexHtml = await readFile("appPackages/testApp/public/unauthenticated/index.html", "utf8");

        expect(response.text).toBe(expectedIndexHtml);
        
    });

    it("should serve specified files when unauthenticated", async () => {
        const response = await app.get("/testApp/app.js")
                            .expect(statusCodes.OK);

        const expectedFile = await readFile("appPackages/testApp/public/unauthenticated/app.js", "utf8");

        expect(response.text).toBe(expectedFile);
        
    });

    it("should serve main index.html as default when authenticated", async () => {
        const response = await app.get("/testApp")
                            .set("cookie", app.credentials.testAppUser1.cookie)
                            .expect(statusCodes.OK);

        const expectedIndexHtml = await readFile("appPackages/testApp/public/main/index.html", "utf8");

        expect(response.text).toBe(expectedIndexHtml);
        
    });

    it("should serve specified files when authenticated", async () => {
        const response = await app.get("/testApp/budibase-client.js")
                            .set("cookie", app.credentials.testAppUser1.cookie)
                            .expect(statusCodes.OK);

        const expectedFile = await readFile("appPackages/testApp/public/main/budibase-client.js", "utf8");

        expect(response.text).toBe(expectedFile);
        
    });


    it("should serve file from shared when authenticated", async () => {
        const response = await app.get("/testApp/_shared/shared_file.txt")
                            .set("cookie", app.credentials.testAppUser1.cookie)
                            .expect(statusCodes.OK);

        const expectedFile = await readFile("appPackages/testApp/public/_shared/shared_file.txt", "utf8");

        expect(response.text).toBe(expectedFile);
        
    });

    it("should serve file from shared when not authenticated", async () => {
        const response = await app.get("/testApp/_shared/shared_file.txt")
                            .expect(statusCodes.OK);

        const expectedFile = await readFile("appPackages/testApp/public/_shared/shared_file.txt", "utf8");

        expect(response.text).toBe(expectedFile);
        
    });

}
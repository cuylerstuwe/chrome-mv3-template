jest.spyOn(global.console, "log").mockImplementation();
import("./startedLog");

test("When the startedLog module is imported, it logs 'Started.' to the console as a side-effect.", () => {
    expect(console.log).toBeCalledWith("Started.");
});
export const allMessageTypes = 
{
    addTwoNumbers: 
        (a: any, b: any) => {
            return new Promise((resolve) => {
                chrome.runtime.sendMessage({ type: "addTwoNumbers", args: [a, b] }, resolve);
            });
        },
    blah: 
        () => {
            return new Promise((resolve) => {
                chrome.runtime.sendMessage({ type: "blah", args: [] }, resolve);
            });
        },
    fetchWorldTime: 
        (endpoint="ip") => {
            return new Promise((resolve) => {
                chrome.runtime.sendMessage({ type: "fetchWorldTime", args: [endpoint] }, resolve);
            });
        },
}
;

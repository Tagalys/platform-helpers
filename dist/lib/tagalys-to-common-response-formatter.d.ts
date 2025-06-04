declare class TagalysToCommonResponseFormatter {
    formatDetail: (detail: any) => any;
    formatMetafields(detail: any): any;
    helpersToExpose(): {
        formatDetail: (detail: any) => any;
    };
    static export(): {
        TagalysToCommonResponseFormatter: {
            new: () => {
                formatDetail: (detail: any) => any;
            };
        };
    };
}
export default TagalysToCommonResponseFormatter;

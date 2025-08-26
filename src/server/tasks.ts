import { AppServer } from "./server";

export async function cleanupMessages(this: AppServer) {
    try {
        const maxDate = new Date(Date.now() - this.config.cleanup.messageTTL * 1000);
        const count = await this.database.deleteOldMessages(maxDate);
        await this.database.deleteOldConfirmedSteps(maxDate);

        if (count) this.logger.info(`${count} outdated messages were cleared`);
    } catch (error) {
        this.logger.warn("Error occurred while cleaning the messages", error);
    }
}

export async function cleanupFiles(this: AppServer) {
    try {
        const maxDate = new Date(Date.now() - this.config.cleanup.fileTTL * 1000);
        const deletedIDs = await this.database.deleteOldFiles(maxDate);
        await Promise.all(deletedIDs.map((id) => this.fileStorage.deleteByID(id)));

        if (deletedIDs.length) this.logger.info(`${deletedIDs.length} outdated files were cleared`);
    } catch (error) {
        this.logger.warn("Error occurred while cleaning the files", error);
    }
}

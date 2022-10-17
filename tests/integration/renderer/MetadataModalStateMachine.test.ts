import { metadataModalMachine } from "@renderer/components/modals/MetadataModal/MetadataModalStateMachine";
import { noop } from "lodash";
import { interpret } from "xstate";

describe.skip("metadataModalStateMachine", () => {
  const service = interpret(metadataModalMachine);

  afterEach(() => {
    service.stop();
  });

  describe("metadataView", () => {
    beforeEach(() => {
      service.start();
    });
    it("should start on initialView", () => {
      expect(service.state.matches("metadataView")).toBeTruthy();
    });

    it("should transition to dropzone on IMPORT", () => {
      expect(service.send("IMPORT").matches("importDropzone")).toBeTruthy();
    });
  });

  describe("importDropzone", () => {
    beforeEach(() => {
      service.start("importDropzone");
    });

    it("should transition to importPreview on FILE_PATH_PICKED with filePath set", () => {
      const filePath = "/test/file/path";
      service.send({
        filePath,
        type: "FILE_PATH_PICKED",
      });

      expect(service.state.matches("importPreview")).toBeTruthy();
      expect(service.state.context.filePath).toEqual(filePath);
    });
  });

  describe("importPreview", () => {
    describe("loading", () => {
      it("should redirect to importPreview.view with first row loaded on success", async () => {
        const firstRow = {
          key: "value",
        };

        const importPreviewService = interpret(
          metadataModalMachine.withConfig({
            services: {
              loadPreview: () => async () => {
                return Promise.resolve(firstRow);
              },
            },
          })
        );

        importPreviewService.start("importDropzone").send({
          filePath: "/path/to/file",
          type: "FILE_PATH_PICKED",
        });

        await new Promise<void>((resolve) => {
          importPreviewService.onTransition((state) => {
            if (state.matches("importPreview.view")) {
              resolve();
            }
          });
        });

        expect(importPreviewService.state.context.firstRow).toEqual(firstRow);
      });

      it("should notify an error and redirect to view on error", async () => {
        let errorNotified = false;
        const importPreviewService = interpret(
          metadataModalMachine.withConfig({
            actions: {
              notifyError: () => {
                errorNotified = true;
              },
            },
            services: {
              loadPreview: () => async () => {
                return Promise.reject(new Error("Error"));
              },
            },
          })
        );

        importPreviewService.start("importDropzone").send({
          filePath: "/path/to/file",
          type: "FILE_PATH_PICKED",
        });

        await new Promise<void>((resolve) => {
          importPreviewService.onTransition((state) => {
            if (state.matches("importPreview.view")) {
              resolve();
            }
          });
        });

        expect(errorNotified).toBeTruthy();
      });
    });

    describe("view", () => {
      it("should redirect to main view on abort", () => {
        service.start("importPreview").send("ABORT");

        expect(service.state.matches("metadataView")).toBeTruthy();
      });

      it("should load metadata on continue", () => {
        const testService = interpret(metadataModalMachine);

        testService.start({ importPreview: "view" }).send("CONTINUE");

        expect(testService.state.matches("loadingMetadata")).toBeTruthy();
      });

      it("should return to dropzone on retry", () => {
        const testService = interpret(metadataModalMachine);

        testService.start({ importPreview: "view" }).send("RETRY");

        expect(testService.state.matches("importDropzone")).toBeTruthy();
      });
    });

    describe("loadingMetadata", () => {
      it("should notifyError and redirect to importPreview on error and notify the error", async () => {
        let resolveNotifyError = noop;
        const notifyErrorCalled = new Promise<void>(
          (resolve) => (resolveNotifyError = resolve)
        );

        const testService = interpret(
          metadataModalMachine.withConfig({
            actions: {
              notifyError: resolveNotifyError,
            },
            services: {
              loadMetadata: () => async () => Promise.reject(),
            },
          })
        );

        await new Promise<void>((resolve) =>
          testService
            .start({ importPreview: "view" })
            .onTransition((state) => {
              if (state.matches("importPreview.view")) {
                resolve();
              }
            })
            .send("CONTINUE")
        );

        await expect(notifyErrorCalled).resolves.toBeTruthy();
      });

      it("should redirect to metadataView on success", async () => {
        const testService = interpret(
          metadataModalMachine.withConfig({
            services: {
              loadMetadata: () => async () => Promise.resolve(),
            },
          })
        );

        await new Promise<void>((resolve) =>
          testService
            .start({ importPreview: "view" })
            .onTransition((state) => {
              if (state.matches("metadataView")) {
                resolve();
              }
            })
            .send("CONTINUE")
        );
      });
    });
  });
});

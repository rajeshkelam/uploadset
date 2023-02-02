_launchRemoveAttachDialog(owner, guid, selectedAttachment) {
                var that = this;
                if (!this.oRemoveAttachDialog) {
                    this.oRemoveAttachDialog = new sap.m.Dialog({
                        type: MessageType.Message,
                        title: "Confirm",
                        content: new sap.m.Text({ text: "Do you want to remove selected attachment?" }),
                        beginButton: new sap.m.Button({
                            type: ButtonType.Emphasized,
                            text: "Yes",
                            press: function () {
                                that._deleteAttachment(owner, guid, selectedAttachment);
                                this.oRemoveAttachDialog.close();
                            }.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            text: "Cancel",
                            press: function () {
                                this.oRemoveAttachDialog.close();
                            }.bind(this)
                        })
                    });
                }

                this.oRemoveAttachDialog.open();
            },
            _deleteAttachment: function (owner, guid, attachment) {
                let that = this;
                const oUploadSet = this.getView().byId("idAttach");
                const loggedUser = sap.ushell.Container.getService("UserInfo").getUser().getId();
                if (loggedUser === owner) {
                    const sPath = "/PR_AttachmentSet('" + guid + "')";
                    sap.ui.core.BusyIndicator.show();
                    this.oModel.remove(sPath, {
                        success: (oData) => {
                            that._showToast("File removed successfully");
                            oUploadSet.removeItem(attachment);
                            attachment ? attachment.destroy() : null;
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: (oError) => {
                            that._showToast("Error while deleting the file");
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });
                } else {
                    that._showToast("File can't be removed, you are not the owner of the selected file");
                }
            },
            onRemovePressed: function (oEvent) {
                //prevent SAPs standard event chain
                oEvent.preventDefault();
                // launch confirmation dialog for user decision
                const fileOwner = (oEvent.getSource().getStatuses()[0]).getText();
                const fileGUID = (oEvent.getSource().getUrl()).split("'")[1];
                const oItem = oEvent.getParameter("item");

                this._launchRemoveAttachDialog(fileOwner, fileGUID, oItem);

            },

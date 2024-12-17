<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-body">
              <div class="tab-content" id="pills-tabContent">
                <form class="theme-form theme-form-2 mega-form">
                  <div class="row">
                    <div class="mb-3 row align-items-center">
                      <label class="form-label-title col-lg-2 col-md-3 mb-0"
                        >Menu Name</label
                      >
                      <div class="col-md-9 col-lg-10">
                        <input class="form-control" type="text" />
                      </div>
                    </div>

                    <div class="mb-3 row">
                      <label class="form-label-title col-sm-2 mb-0"
                        >Description</label
                      >
                      <div class="col-sm-10">
                        <div id="editor">
                          <ckeditor
                            :editor="editor"
                            v-model="editorData"
                            :config="editorConfig"
                          ></ckeditor>
                        </div>
                      </div>
                    </div>

                    <div class="mb-3 row align-items-center">
                      <label class="col-sm-2 col-form-label form-label-title"
                        >Dimensions <span class="theme-color">(cm)</span></label
                      >
                      <div class="col-sm-10">
                        <select
                          class="js-example-basic-single form-select"
                          name="state"
                        >
                          <option>Public</option>
                          <option>Private</option>
                        </select>
                      </div>
                    </div>

                    <div class="mb-3 row align-items-center">
                      <label class="form-label-title col-lg-2 col-md-3 mb-0"
                        >Permanlink</label
                      >
                      <div class="col-md-9 col-lg-10">
                        <input class="form-control" type="url" />
                      </div>
                    </div>

                    <div class="mb-4 row align-items-center">
                      <label class="form-label-title col-lg-2 col-md-3 mb-0"
                        >Status</label
                      >
                      <div class="col-md-9">
                        <div class="form-check user-checkbox ps-0">
                          <input
                            class="checkbox_animated check-it"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            for="flexCheckDefault"
                            class="form-label-title col-md-2 mb-0"
                            >Enable the Menu</label
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  name: "createMenu",
  title: "Voxo-Create Menu",
  data() {
    return {
      editor: ClassicEditor,
      editorData: "",
      editorConfig: {
        // The configuration of the editor.
      },
    };
  },
};
</script>

<style></style>

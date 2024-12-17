<template>
  <div class="tab-pane fade show active" id="pills-profile" role="tabpanel">
    <form class="theme-form theme-form-2 mega-form">
      <div class="card-header-1">
        <h5>Restriction</h5>
      </div>

      <div class="row">
        <div class="mb-4 row align-items-center">
          <label class="form-label-title col-lg-2 col-md-3 mb-0"
            >Products</label
          >
          <div class="col-md-9 col-lg-10">
            <input class="form-control" type="text" />
          </div>
        </div>

        <div class="mb-4 row align-items-center">
          <label class="col-sm-2 col-form-label form-label-title"
            >Category</label
          >
          <div class="col-sm-10">
            <select class="js-example-basic-single form-select" name="state">
              <option disabled>--Select--</option>
              <option>Electronics</option>
              <option>Clothes</option>
              <option>Shoes</option>
              <option>Digital</option>
            </select>
          </div>
        </div>

        <div class="mb-4 row align-items-center">
          <label class="col-lg-2 col-md-3 col-form-label form-label-title"
            >Minimum Spend</label
          >
          <div class="col-md-9 col-lg-10">
            <input class="form-control" type="number" />
          </div>
        </div>

        <div class="row align-items-center">
          <label class="col-lg-2 col-md-3 col-form-label form-label-title"
            >Maximum Spend</label
          >
          <div class="col-md-9 col-lg-10">
            <input class="form-control" type="number" />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style></style>

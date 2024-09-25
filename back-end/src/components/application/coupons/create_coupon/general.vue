<template>
  <div class="tab-pane fade show active" id="pills-home" role="tabpanel">
    <form class="theme-form theme-form-2 mega-form">
      <div class="card-header-1">
        <h5>General</h5>
      </div>

      <div class="row">
        <div class="mb-4 row align-items-center">
          <label class="form-label-title col-lg-2 col-md-3 mb-0">Coupon Title</label>
          <div class="col-md-9 col-lg-10">
            <input class="form-control" type="text" />
          </div>
        </div>

        <div class="mb-4 row align-items-center">
          <label class="col-lg-2 col-md-3 col-form-label form-label-title">Coupon Code</label>
          <div class="col-md-9 col-lg-10">
            <input class="form-control" type="number" />
          </div>
        </div>

        <div class="mb-4 row align-items-center">
          <label class="col-lg-2 col-md-3 col-form-label form-label-title">Start Date</label>
          <div class="col-md-9 col-lg-10">
            <input class="form-control" type="date" />
          </div>
        </div>

        <div class="mb-4 row align-items-center">
          <label class="col-lg-2 col-md-3 col-form-label form-label-title">End Date</label>
          <div class="col-md-9 col-lg-10">
            <input class="form-control" type="date" />
          </div>
        </div>

        <div class="mb-4 row align-items-center">
          <label class="form-label-title col-lg-2 col-md-3 mb-0">Free Shipping</label>
          <div class="col-md-9">
            <div class="form-check user-checkbox ps-0">
              <input class="checkbox_animated check-it" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-label-title col-md-2 mb-0" for="flexCheckDefault">Allow Free Shipping</label>
            </div>
          </div>
        </div>

        <div class="mb-4 row align-items-center">
          <label class="col-lg-2 col-md-3 col-form-label form-label-title">Quantity</label>
          <div class="col-md-9 col-lg-10">
            <input class="form-control" type="number" />
          </div>
        </div>

        <div class="mb-4 row align-items-center">
          <label class="col-sm-2 col-form-label form-label-title">Discount Type</label>
          <div class="col-sm-10">
            <select class="js-example-basic-single form-select" name="state">
              <option disabled>--Select--</option>
              <option>Percent</option>
              <option>Fixed</option>
            </select>
          </div>
        </div>

        <div class="row align-items-center">
          <label class="form-label-title col-lg-2 col-md-3 mb-0">Status</label>
          <div class="col-md-9">
            <div class="form-check user-checkbox ps-0">
              <input class="checkbox_animated check-it" type="checkbox" value="" id="flexCheckDefault1" />
              <label for="flexCheckDefault1" class="form-label-title col-md-2 mb-0">
                Enable the Coupon</label>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>

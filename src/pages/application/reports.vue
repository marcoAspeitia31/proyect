<template>
  <div class="row">
    <!-- Salery Summy star-->
    <div class="col-xl-8 col-lg-12 col-md-6">
      <div class="card o-hidden">
        <div class="card-header border-0 pb-1">
          <div class="card-header-title">
            <h4>Resumen de ventas</h4>
          </div>
        </div>
        <div class="card-body p-0">
          <div id="saler-summary">
            <apexchart
              type="bar"
              height="350"
              :options="salesSummary.chartOptions"
              :series="salesSummary.series"
            >
            </apexchart>
          </div>
        </div>
      </div>
    </div>
    <!-- Salery Summy end-->

    <!-- Employ Salary  start-->
    <div class="col-xl-4 col-lg-12 col-md-6">
      <div class="h-100">
        <div class="card o-hidden">
          <div class="card-header border-0 pb-1">
            <div class="d-flex align-items-center justify-content-between">
              <div class="card-header-title">
                <h4>Clientes Satifechos</h4>
              </div>
            </div>
          </div>
          <div class="card-body p-0">
            <div class="pie-chart">
              <div id="employ-salary">
                <apexchart
                  type="area"
                  height="350"
                  :options="employessSatisfiedChart.chartOptions"
                  :series="employessSatisfiedChart.series"
                ></apexchart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Employ Salary end-->

    <!-- Sales / Purchase chart start -->
    <div class="col-xl-15 col-lg-12 col-md-6">
      <div class="card">
        <div class="card-header border-0 pb-1">
          <div class="card-header-title">
            <h4>Compra y Venta</h4>
          </div>
        </div>
        <div class="card-body p-0">
          <div id="sales-purchase-chart">
            <apexchart
              type="bar"
              height="350"
              :options="salePurchaseChart.chartOptions"
              :series="salePurchaseChart.series"
            ></apexchart>
          </div>
        </div>
      </div>
    </div>
    <!-- Sales / Purchase chart end -->

    <!-- Sales / Purchase Return star-->
    <div class="col-12">
      <div class="card o-hidden">
        <div class="card-header border-0 pb-1">
          <div class="card-header-title">
            <h4>Ventas/ Ventas Canceladas</h4>
          </div>
        </div>
        <div class="card-body p-0">
          <div id="sales-purchase-return-cart">
            <apexchart
              type="area"
              height="350"
              :options="salePurchaseReturnChart.chartOptions"
              :series="salePurchaseReturnChart.series"
            ></apexchart>
          </div>
        </div>
      </div>
    </div>
    <!-- Sales / Purchase Return end-->

    <!-- Booking history start-->
    <div class="col-12">
      <div class="card">
        <div class="card-header border-0 pb-1">
          <div class="card-header-title">
            <h4>Ultimas Ventas</h4>
          </div>
        </div>

        <div class="card-body">
          <div>
            <div class="table-responsive table-desi">
              <table class="user-table list-table table table-striped">
                <thead>
                  <tr>
                    <th>Folio</th>
                    <th>Cliente</th>
                    <th>Fecha y Hora</th>
                    <th>Total</th>
                    <th>Options</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Booking history  end-->
  </div>
</template>

<script>
import charts from "@/data/charts.js";
export default {
  title: "SK-Reportes",
  data() {
    return {
      salesSummary: charts.salesSummary,
      employessSatisfiedChart: charts.employessSatisfiedChart,
      expensesChart: charts.expensesChart,
      salePurchaseChart: charts.salePurchaseChart,
      salePurchaseReturnChart: charts.salePurchaseReturnChart,
    };
  },
};
</script>

<style></style>

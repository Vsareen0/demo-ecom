function search(val) {
  $.ajax({
    method: "GET",
    url: "/product/findProducts",
    data: { search: val }
  })
    .fail(function(err) {
      console.log(err);
    })
    .done(function(data) {
      console.log(data);

      var list = [];
      data.result.forEach(function(item) {
        list.push(
          `<li value="${item.product_name}" onclick="loadSearchedProduct(this);">${item.product_name}</li>`
        );
      });

      var updatedList = [...new Set(list)];
      var searchedList = document.getElementsByClassName(
        "searchedProductList"
      )[0];
      searchedList.innerHTML = updatedList.join(" ");
    });
}

function clearList() {
  var searchedList = document.getElementsByClassName("searchedProductList")[0];
  searchedList.innerHTML = "";
}

function filterBox() {
  var checkVisibility = document.querySelector(".filterVisibility");
  checkVisibility.classList.toggle("fa-forward");
  checkVisibility.classList.toggle("fa-backward");

  if (checkVisibility.classList.contains("fa-backward")) {
    $(".filterPane")
      .css("transition", ".3s ease-in all")
      .width("40vh");
  }
  if (checkVisibility.classList.contains("fa-forward")) {
    $(".filterPane")
      .css("transition", ".3s ease-in all")
      .width("-40vh");
  }
}

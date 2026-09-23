let products=[];

for(let category of storeData.categories){
    for(let subcategory of category.subcategories){
        for(let product of subcategory.products){
            products.push(product);
        }
    }
}

products.sort((a,b)=>a.price-b.price);


function binarySearch(price){

    let left=0;
    let right=products.length-1;

    while(left<=right){

        let mid=Math.floor((left+right)/2);

        if(products[mid].price==price){
            return mid;
        }

        if(products[mid].price<price){
            left=mid+1;
        }
        else{
            right=mid-1;
        }
    }

    return left;
}


function searchPrice(){

    let price=Number(document.getElementById("price").value);

    if(price<=0){
        alert("Enter a valid price");
        return;
    }

    let index=binarySearch(price);

    let result=[];

    if(index<products.length){
        result.push(products[index]);
    }

    if(index>0){
        result.push(products[index-1]);
    }

    if(index+1<products.length){
        result.push(products[index+1]);
    }

    result.sort((a,b)=>{
        return Math.abs(a.price-price)-Math.abs(b.price-price);
    });

    result=result.slice(0,3);

    showProducts(result);
}


function lowerBound(price){

    let left=0;
    let right=products.length;

    while(left<right){

        let mid=Math.floor((left+right)/2);

        if(products[mid].price<price){
            left=mid+1;
        }
        else{
            right=mid;
        }
    }

    return left;
}


function searchRange(){

    let min=Number(document.getElementById("minPrice").value);
    let max=Number(document.getElementById("maxPrice").value);

    if(min<=0 || max<=0){
        alert("Enter valid prices");
        return;
    }

    if(min>max){
        alert("Minimum price should be less than maximum price");
        return;
    }

    let start=lowerBound(min);
    let result=[];

    for(let i=start;i<products.length;i++){

        if(products[i].price>max){
            break;
        }

        result.push(products[i]);
    }

    showProducts(result);
}


function showProducts(result){

    let output=document.getElementById("result");

    if(result.length==0){
        output.innerHTML="<h2>No products found</h2>";
        return;
    }

    let html="<h2>Products</h2>";
    html+="<div class='products'>";

    for(let product of result){

        html+=`
            <div class="card">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price.toLocaleString("en-IN")}</p>
                <p>Brand: ${product.brand}</p>
                <p>Rating: ⭐ ${product.rating}</p>
                <button>View Product</button>
            </div>
        `;
    }

    html+="</div>";

    output.innerHTML=html;
}


let searchInput=document.getElementById("searchInput");
let suggestions=document.getElementById("suggestions");
let selectedIndex=-1;


searchInput.addEventListener("input",function(){

    let text=searchInput.value.toLowerCase().trim();

    selectedIndex=-1;

    if(text==""){
        suggestions.innerHTML="";
        return;
    }

    let result=[];

    for(let product of products){

        let name=product.name.toLowerCase();
        let brand=product.brand.toLowerCase();
        let tags=product.tags.join(" ").toLowerCase();

        let score=0;

        if(name.startsWith(text)){
            score=1;
        }
        else if(name.includes(text)){
            score=2;
        }
        else if(brand.startsWith(text)){
            score=3;
        }
        else if(brand.includes(text)){
            score=4;
        }
        else if(tags.includes(text)){
            score=5;
        }

        if(score>0){
            result.push({
                product:product,
                score:score
            });
        }
    }

    result.sort((a,b)=>a.score-b.score);

    result=result.slice(0,5);

    showSuggestions(result,text);
});


function showSuggestions(result,text){

    if(result.length==0){
        suggestions.innerHTML="<div class='empty'>No products found</div>";
        return;
    }

    let html="";

    for(let i=0;i<result.length;i++){

        let product=result[i].product;
        let name=product.name;

        let highlighted=name.replace(
            new RegExp(text,"gi"),
            function(match){
                return "<strong>"+match+"</strong>";
            }
        );

        html+=`
            <div class="suggestion" onclick="selectProduct(${products.indexOf(product)})">
                ${highlighted}
            </div>
        `;
    }

    suggestions.innerHTML=html;
}


searchInput.addEventListener("keydown",function(event){

    let items=document.querySelectorAll(".suggestion");

    if(items.length==0){
        return;
    }

    if(event.key=="ArrowDown"){

        event.preventDefault();

        selectedIndex++;

        if(selectedIndex>=items.length){
            selectedIndex=0;
        }

        updateSelection(items);
    }

    else if(event.key=="ArrowUp"){

        event.preventDefault();

        selectedIndex--;

        if(selectedIndex<0){
            selectedIndex=items.length-1;
        }

        updateSelection(items);
    }

    else if(event.key=="Enter"){

        event.preventDefault();

        if(selectedIndex>=0){
            items[selectedIndex].click();
        }
    }
});


function updateSelection(items){

    for(let item of items){
        item.classList.remove("active");
    }

    if(selectedIndex>=0){
        items[selectedIndex].classList.add("active");
    }
}


function selectProduct(index){

    let product=products[index];

    searchInput.value=product.name;
    suggestions.innerHTML="";

    showProducts([product]);
}


document.addEventListener("click",function(event){

    if(!event.target.closest(".autocomplete")){
        suggestions.innerHTML="";
    }
});
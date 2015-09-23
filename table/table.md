# 表格

在各种业务项目中，表格相关的需求算是很普遍的，我们可能需要把表格展示出来，并且在其中增删数据，排序，过滤，单选，复选，这些功能如果使用传统的jQuery代码来开发，会比较麻烦，使用AngularJS这样带有数据绑定的框架来做，可以非常简单。

## 表格数据的简单绑定

在Angular中，ng-repeat指令可用于迭代数组或者对象，所以，如果我们有这样的数据：

```JavaScript
angular.module("demo", [])
	.controller("CartCtrl", ["$scope", function ($scope) {
		$scope.goods = [
			{name: "苹果🍎", price: 5, count: 1, description: "亚当和夏娃"},
			{name: "橙子🍊", price: 3, count: 2, description: "富含维生素C"},
			{name: "香蕉🍌", price: 4, count: 1, description: "猴子最爱"}
		];
	}]);
```

很自然地就可以用它来生成表格：

```HTML
...
<tr ng-repeat="item in goods">
	<td>{{item.name}}</td>
	<td>{{item.price}}</td>
	<td>{{item.count}}</td>
	<td>{{item.count * item.price}}元</td>
</tr>
...
```

这样表格就可以生成出来了。这一步是非常简单的，因为就算使用静态的一些模板，也可以同样简单地达到目的。

## 数组的一些全局操作

那如果我们想要向这个表格中添加一条数据怎么办呢，因为Angular中的模板并非静态的，而是动态绑定在数据上的，所以，只要在原始数据上修改就可以了。

```JavaScript
$scope.append = function () {
	$scope.goods.push({
		name: "小狗🐶" + $scope.goods.length,
		price: 5+Math.ceil(Math.random()*20),
		count: 1, 
		description: "人类的好朋友"
	});
};
```

这样，无需额外的操作，数据就会同步到界面上，追加到表格的现有数据后面。同理，如果我们想要把新数据加到表格最前面，也只要在添加数据的时候，往数组的最前面加就可以了：

```JavaScript
$scope.prepend = function () {
	$scope.goods.unshift({
		name: "🌲" + $scope.goods.length,
		price: 10+Math.ceil(Math.random()*10),
		count: 2, 
		description: "铃儿响叮当"
	});
};
```

如果我们想要对数据进行排序，比如按照年龄排序，也还是在原始数据上操作：

```JavaScript
$scope.sort = function () {
	$scope.goods.sort(function (a, b) {
		return a.price - b.price;
	});
};
```

## 数据删除

在表格里面，可能还会需要有一些操作，比如，每个行上可能会有一个操作按钮，点一下就把这一行删了，跟前面的例子相比，这个的特点是，需要知道删除哪一行，所以要传入额外的参数：

```HTML
...
<tr ng-repeat="item in goods">
	<td>{{item.name}}</td>
	<td>{{item.price}}</td>
	<td>{{item.count}}</td>
	<td>{{item.count * item.price}}元</td>
	<td>
		<button class="btn btn-sm btn-warning" ng-click="remove(item)">删除</button>
	</td>
</tr>
...
```

这里，只要把迭代项传过去就可以了，然后，在js里变更数据：

```JavaScript
$scope.remove = function (item) {
	$scope.goods = $scope.goods.filter(function (it) {
		return it != item;
	});
};
```

## 展开折叠

有时候，我们可能会需要把单行展开，显示详细信息，这时候，因为tr中只能包含td，而td不足以表达多行数据，所以可以使用两个tr来做这个事情。

在Angular中，ng-repeat只能指定到为一个元素，但如果我们想要有多个平级元素一起循环，难道只能用一个容器把它们先包含起来，然后在循环这个容器吗？在我们的表格中，还是不太合适，因为多个tr再搞一个父容器，逻辑上不是很好，我们可以使用ng-repeat-begin和ng-repeat-end来把一组元素括起来：

```HTML
<tr ng-repeat-start="item in goods">
	<td>
		<button class="btn btn-xs btn-default"
		        ng-click="item.$expand=!item.$expand"
		        ng-class="{'dropdown-toggle':!item.$expand, 'dropup':item.$expand}">
			<span class="caret"></span>
		</button>
		{{item.name}}
	</td>
	...
</tr>
<tr ng-repeat-end ng-show="item.$expand">
	<td colspan="5">{{item.description}}</td>
</tr>
```

然后，在第二个tr上绑定到item中的一个变量$expand，然后在第一个tr中的某个按钮上，点击的时候切换对应item的$expand的值，就可以实现这个切换了，并且，可以用ng-class的绑定，切换按钮上面的图标。

## 全选和单条选择的控制

另外有个常见需求，我们可能会需要选中某几行，做一些操作，比如选择购物车中的一些商品，然后支付。

先看看怎样选中每行的checkbox，这可以通过将checkbox绑定到每行对应数据的某个属性上，每次点击的时候，这样，这个checkbox的状态就会跟这一行数据的该属性保持同步：

```HTML
<input type="checkbox" ng-model="item.$checked"/>
```

这里我们可以看到，当点击checkbox的时候，就会给数据项的$checked赋值，当给数据项的$checked属性赋值的时候，也会反过来影响到界面。同理，我们给表头checkbox的全选功能也加一下这个功能：

```HTML
<input type="checkbox" ng-model="$allChecked"/>
```

但这时候并没有解决我们的问题，我们有三个问题要解决：

1. 当点击表头checkbox的时候，需要把所有行的checkbox状态都与之同步，所以我们可以在表头checkbox上加个ng-change，在发生变化的时候调用一个函数：

```HTML
<input type="checkbox" ng-model="$allChecked" ng-change="checkAll()"/>
```

然后，在这个方法里，给所有行的$checked属性赋值：

```JavaScript
$scope.checkAll = function() {
	$scope.goods.forEach(function (it) {
		it.$checked = $scope.$allChecked;
	});
};
```

这样，我们点击表头的checkbox，可以控制所有行的checkbox状态了。

2. 点击某行checkbox的时候，随时要查看当前已选条数，如果所有的都被选中了，应当自动把表头的checkbox也选起来，所以，每一行的checkbox也需要一个ng-change：

```HTML
<input type="checkbox" ng-model="item.$checked" ng-change="checkItem(item)"/>
```

然后，在这个checkItem里面，根据数组里面是否全选，给$allChecked属性赋值，这样控制表头checkbox的选中状态：

```JavaScript
$scope.checkItem = function(item) {
	$scope.$allChecked = $scope.goods.every(function(it) {
		return it.$checked;
	});
};
```

这样，我们点击每行的checkbox，也可以控制表头的checkbox状态了。

3. 但是还存在一个问题，如果这时候又向表格里添加了新数据，如何同步表头的状态呢？可以通过$watchCollection，监控goods数组的变化，注意，这里用浅监控就醒了，只监控一层，不必监控深层数据的变更。

```JavaScript
$scope.$watchCollection("goods", function(val) {
	$scope.$allChecked = $scope.goods.every(function(it) {
		return it.$checked;
	});
});
```

这样就完成了数据状态的同步。

## 数组数据的统计

有的时候，我们需要对表格中的数据进行实时统计，比如购物车，需要统计总价等信息，可以用一个函数来计算这个总价，然后在界面上绑定这个函数。

```HTML
总价为{{total()}}元
```

```JavaScript
$scope.total = function () {
	return $scope.goods.reduce(function(prev, next) {
		return prev + next.count * next.price;
	}, 0);
};
```

如果是包含复选的那种，比如购物车需要选中一些商品然后提交付费，也是类似的方式，只需要在求和的时候判断一下就行了：

```JavaScript

$scope.totalToPay = function () {
	return $scope.goods.reduce(function(prev, next) {
		return next.$checked ? prev + next.count * next.price : prev;
	}, 0);
};
```

## 其他状态控制

前面例子提到选中某些商品支付，如果有一个支付按钮，它必须要有选中的商品才可以点，可以使用ng-disabled绑定到一个统计函数：

```HTML
<button class="btn btn-default" ng-disabled="!someChecked()">支付</button>
```

然后在这个someChecked函数里，检查一下当前有没有选中的行：

```JavaScript
$scope.someChecked = function() {
	return $scope.goods.some(function(it) {
		return it.$checked;
	});
};
```

## 动态编辑

有时候还会有动态编辑的需求，也就是说，直接在展示的表格中点击一个编辑按钮，该行就切换到编辑状态，这个在Angular里面也非常容易做到。

我们把一行的界面元素区分为两组，一组是编辑状态，一组是查看状态，两组元素分别用ng-if绑定到该行数据的编辑状态：

```HTML
<tr ng-repeat="item in goods">
	<td>
		<span ng-if="!item.$editing">{{item.name}}</span>
		<input ng-model="item.name" ng-if="item.$editing"/>
	</td>
	...
	<td>
		<button class="btn btn-sm btn-warning" ng-if="!item.$editing" ng-click="item.$editing=true">修改</button>
		<button class="btn btn-sm btn-primary" ng-if="item.$editing" ng-click="item.$editing=false">保存</button>
	</td>
</tr>
```

这样就可以了，都不必在js上加额外的东西。

## 小结

以上是我们常见的对表格相关的操作，对于初学者而言，最关键的事情是需要时刻注意：

- 所有界面上的操作，都应当直接在数据上进行修改
- 界面的展示状态是绑定到数据上的，是它自己根据数据刷新出来的，不存在手工的从数据刷新界面

所以，大部分事情都是通过数组的相关操作完成的，适当使用ES5带给Array的一些方法，比如forEach, filter，some，reduce，可以让代码更精炼。

代码放在[这里](https://github.com/xufei/ng-demo/blob/master/table/table.html)
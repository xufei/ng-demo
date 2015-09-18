# 表格

在各种业务项目中，表格相关的需求算是很普遍的，我们可能需要把表格展示出来，并且在其中增删数据，排序，过滤，单选，复选，这些功能如果使用传统的jQuery代码来开发，会比较麻烦，使用AngularJS这样带有数据绑定的框架来做，可以非常简单。

## 表格数据的简单绑定

在Angular中，ng-repeat指令可用于迭代数组或者对象，所以，如果我们有这样的数据：

```JavaScript
angular.module("demo", [])
	.controller("CartCtrl", [function () {
		this.goods = [
			{name: "苹果🍎", price: 5, count: 1, description: "亚当和夏娃"},
			{name: "橙子🍊", price: 3, count: 2, description: "富含维生素C"}
		];
	}]);
```

很自然地就可以用它来生成表格：

```HTML
...
<tr ng-repeat="item in cartCtrl.goods">
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
this.append = function () {
	this.goods.push({
		name: "小狗🐶" + this.goods.length,
		price: 5+Math.ceil(Math.random()*20),
		count: 1, 
		description: "人类的好朋友"
	});
};
```

这样，无需额外的操作，数据就会同步到界面上，追加到表格的现有数据后面。同理，如果我们想要把新数据加到表格最前面，也只要在添加数据的时候，往数组的最前面加就可以了：

```JavaScript
this.prepend = function () {
	this.goods.unshift({
		name: "🌲" + this.goods.length,
		price: 10+Math.ceil(Math.random()*10),
		count: 2, 
		description: "铃儿响叮当"
	});
};
```

如果我们想要对数据进行排序，比如按照年龄排序，也还是在原始数据上操作：

```JavaScript
this.sort = function () {
	this.goods.sort(function (a, b) {
		return a.price - b.price;
	});
};
```

## 数据删除

在表格里面，可能还会需要有一些操作，比如，每个行上可能会有一个操作按钮，点一下就把这一行删了，跟前面的例子相比，这个的特点是，需要知道删除哪一行，所以要传入额外的参数：

```HTML
...
<tr ng-repeat="item in cartCtrl.goods">
	<td>{{item.name}}</td>
	<td>{{item.price}}</td>
	<td>{{item.count}}</td>
	<td>{{item.count * item.price}}元</td>
	<td>
		<button class="btn btn-sm btn-warning" ng-click="cartCtrl.remove(item)">删除</button>
	</td>
</tr>
...
```

这里，只要把迭代项传过去就可以了，然后，在js里变更数据：

```JavaScript
this.remove = function (item) {
	return this.goods = this.goods.filter(function (it) {
		return it != item;
	});
};
```

## 数组数据的统计

有的时候，我们需要对表格中的数据进行实时统计，比如购物车，需要统计总价等信息，可以用一个函数来计算这个总价，然后在界面上绑定这个函数。

```HTML
总价为{{cartCtrl.total()}}元
```

```JavaScript
this.total = function () {
	var total = 0;
	this.goods.forEach(function (it) {
		total += it.count * it.price;
	});

	return total;
};
```

## 展开折叠

有时候，我们可能会需要把单行展开，显示详细信息，这时候，因为tr中只能包含td，而td不足以表达多行数据，所以可以使用两个tr来做这个事情。

在Angular中，ng-repeat只能指定到为一个元素，但如果我们想要有多个平级元素一起循环，难道只能用一个容器把它们先包含起来，然后在循环这个容器吗？在我们的表格中，还是不太合适，因为多个tr再搞一个父容器，逻辑上不是很好，我们可以使用ng-repeat-begin和ng-repeat-end来把一组元素括起来：

```HTML
<tr ng-repeat-start="item in cartCtrl.goods">
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

## 单选和复选的控制


## 小结

代码放在[这里](https://github.com/xufei/ng-demo/blob/master/table/table.html)
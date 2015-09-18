# 表格

在各种业务项目中，表格相关的需求算是很普遍的，我们可能需要把表格展示出来，并且在其中增删数据，排序，过滤，单选，复选，这些功能如果使用传统的jQuery代码来开发，会比较麻烦，使用AngularJS这样带有数据绑定的框架来做，可以非常简单。

## 表格数据的简单绑定

在Angular中，ng-repeat指令可用于迭代数组或者对象，所以，如果我们有这样的数据：

```JavaScript
angular.module("demo", [])
	.controller("UserCtrl", [function () {
		this.data = [
			{name: "Tom", age: 5, gender: 1},
			{name: "Jerry", age: 3, gender: 0}
		];
	}]);
```

很自然地就可以用它来生成表格：

```HTML
...
<tr ng-repeat="user in userCtrl.data">
	<td>{{user.name}}</td>
	<td>{{user.age}}</td>
	<td>{{user.gender}}</td>
</tr>
...
```

这样表格就可以生成出来了。这一步是非常简单的，因为就算使用静态的一些模板，也可以同样简单地达到目的。

## 数组的一些全局操作

那如果我们想要向这个表格中添加一条数据怎么办呢，因为Angular中的模板并非静态的，而是动态绑定在数据上的，所以，只要在原始数据上修改就可以了。

```JavaScript
this.append = function () {
	this.data.push({name: "someone", age: this.data.length, gender: 1});
};
```

这样，无需额外的操作，数据就会同步到界面上，追加到表格的现有数据后面。同理，如果我们想要把新数据加到表格最前面，也只要在添加数据的时候，往数组的最前面加就可以了：

```JavaScript
this.prepend = function () {
	this.data.unshift({name: "someone before", age: this.data.length, gender: 0});
};
```

如果我们想要对数据进行排序，比如按照年龄排序，也还是在原始数据上操作：

```JavaScript
this.sort = function() {
	this.data.sort(function(a, b) {
		return a.age - b.age;
	});
};
```

## 数据删除

在表格里面，可能还会需要有一些操作，比如，每个行上可能会有一个操作按钮，点一下就把这一行删了，跟前面的例子相比，这个的特点是，需要知道删除哪一行，所以要传入额外的参数：

```HTML
...
<tr ng-repeat="user in userCtrl.data">
	<td>{{user.name}}</td>
	<td>{{user.age}}</td>
	<td>{{user.gender}}</td>
	<td>
		<button class="btn btn-sm btn-warning" ng-click="userCtrl.remove(user)">Delete</button>
	</td>
</tr>
...
```

这里，只要把迭代项传过去就可以了，然后，在js里变更数据：

```JavaScript
this.remove = function (user) {
	return this.data = this.data.filter(function (it) {
		return it != user;
	});
};
```

## 数组数据的统计

有的时候，我们需要对表格中的数据进行实时统计，常见的有购物车等信息。

## 展开折叠

有时候，我们可能会需要把单行展开，显示详细信息，这时候，因为tr中只能包含td，而td不足以表达多行数据，我们可以使用两个tr来做这个事情。
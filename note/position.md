在 CSS 中，元素的定位方式通过 `position` 属性控制，共有 **5 种定位方式**（`static`、`relative`、`absolute`、`fixed`、`sticky`）。以下是它们的详细解释和对比：

---

### **1. `position: static`（默认定位）**
• **特点**：
• 元素遵循正常的文档流布局。
• `top`/`right`/`bottom`/`left` 和 `z-index` 属性无效。
• **使用场景**：普通布局，无需特殊定位时。
• **示例**：
  ```html
  <div class="box">这是默认定位的元素</div>
  ```
  ```css
  .box {
    position: static; /* 默认值，可省略 */
  }
  ```

---

### **2. `position: relative`（相对定位）**
• **特点**：
• 元素仍占据文档流中的原始位置。
• 可通过 `top`/`right`/`bottom`/`left` 相对于 **自身原始位置** 进行微调。
• 会为子元素的绝对定位（`absolute`）创建定位基准。
• **使用场景**：微调元素位置，或作为子元素绝对定位的容器。
• **示例**：
  ```css
  .box {
    position: relative;
    top: 10px;  /* 向下移动 10px */
    left: 20px; /* 向右移动 20px */
  }
  ```
![](https://s3-gz01.didistatic.com/n9e-pub/image/doraemon/20240919133900.png)

---

### **3. `position: absolute`（绝对定位）**
• **特点**：
• 元素脱离文档流，不占据空间。
• 相对于 **最近的非 `static` 定位的祖先元素** 定位。
• 若找不到非 `static` 祖先，则相对于 `<html>` 根元素定位。
• **使用场景**：精准控制元素位置（如弹出菜单、图标叠加）。
• **示例**：
  ```css
  .parent {
    position: relative; /* 创建定位基准 */
  }
  .child {
    position: absolute;
    top: 0;
    right: 0;
  }
  ```
![](https://s3-gz01.didistatic.com/n9e-pub/image/doraemon/20240919133925.png)

---

### **4. `position: fixed`（固定定位）**
• **特点**：
• 元素脱离文档流，不占据空间。
• 相对于 **浏览器视口（viewport）** 定位。
• 滚动页面时元素位置固定不变。
• **使用场景**：固定导航栏、返回顶部按钮、悬浮广告。
• **示例**：
  ```css
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }
  ```
![](https://s3-gz01.didistatic.com/n9e-pub/image/doraemon/20240919133950.png)

---

### **5. `position: sticky`（粘性定位）**
• **特点**：
• 元素在滚动到特定阈值前表现为 `relative`，超过阈值后表现为 `fixed`。
• 需要指定 `top`/`right`/`bottom`/`left` 中的一个作为触发阈值。
• **使用场景**：滚动时吸顶的表头、侧边栏。
• **示例**：
  ```css
  .header {
    position: sticky;
    top: 0; /* 滚动到视口顶部时固定 */
  }
  ```
![](https://s3-gz01.didistatic.com/n9e-pub/image/doraemon/20240919134016.png)

---

### **对比表格**
| 定位方式       | 是否脱离文档流 | 定位基准                  | 是否影响其他元素 | 典型场景               |
|----------------|----------------|--------------------------|----------------|-----------------------|
| `static`       | 否             | 无                        | 否             | 默认布局               |
| `relative`     | 否             | 自身原始位置               | 否             | 微调位置，创建定位基准 |
| `absolute`     | 是             | 最近非 `static` 祖先       | 是             | 弹出菜单，精准定位     |
| `fixed`        | 是             | 视口（viewport）           | 是             | 固定导航栏，悬浮广告   |
| `sticky`       | 否 → 是（滚动后）| 视口（滚动触发后）         | 否 → 是        | 吸顶表头，滚动侧边栏   |

---

### **总结**
• **常规布局**：用 `static`（默认）或 `relative`。
• **精准定位**：用 `absolute`（需父级设置 `relative`）。
• **固定元素**：用 `fixed`。
• **滚动吸附**：用 `sticky`。

根据需求选择合适的定位方式，可以高效控制页面布局！
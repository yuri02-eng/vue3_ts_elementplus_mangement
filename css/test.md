在 CSS 中，当父元素（`.arrow_box`）设置 `position: relative` 时，它的核心作用是 **为子元素的绝对定位（`position: absolute`）提供一个定位基准**。以下是详细解释：

---

### **1. 创建定位上下文（Positioning Context）**
• **默认情况**：如果一个元素的 `position` 是 `static`（默认值），它 **不会创建定位上下文**。
• **关键作用**：当父元素设置 `position: relative` 后，它会成为子元素（如伪元素 `::before`/`::after`）的 **定位基准**，子元素的 `top`/`left`/`right`/`bottom` 会相对于父元素的边界进行定位。

```css
.arrow_box {
  position: relative; /* 创建定位上下文 */
}

.arrow_box::before {
  position: absolute; /* 相对于父元素 .arrow_box 定位 */
  bottom: 100%;
  left: 50%;
}
```

---

### **2. 不破坏父元素的原始布局**
• `position: relative` 的独特之处在于：
• **保持文档流**：父元素仍占据原始位置和空间（不像 `absolute` 或 `fixed` 会脱离文档流）。
• **无需偏移**：即使不设置 `top`/`left` 等偏移属性，父元素的位置也不会改变。

```html
<!-- 父元素保持原有布局 -->
<div class="arrow_box">内容</div>
```

---

### **3. 对比其他定位方式**
如果父元素不设置 `position: relative`，伪元素的定位会如何？

#### 场景 1：父元素为 `static`（默认）
```css
.arrow_box {
  position: static; /* 默认值 */
}
```
• **结果**：伪元素会向上寻找最近的 **非 `static` 祖先元素**，如果找不到，则相对于 **文档根元素（`<html>`）** 定位。
• **问题**：箭头可能脱离父容器，导致布局错乱。

#### 场景 2：父元素为 `absolute` 或 `fixed`
```css
.arrow_box {
  position: absolute; /* 或 fixed */
}
```
• **结果**：父元素脱离文档流，可能影响页面其他元素的布局。

---

### **4. 为什么不用 `position: absolute` 或 `fixed`？**
• `relative` 是最安全的方案，因为它：
1. **不脱离文档流**：父元素仍占据原有空间。
2. **不影响子元素定位**：子元素可以精准相对于父容器定位。
3. **无需额外计算**：不需要通过 `top`/`left` 调整父元素位置。

---

### **总结**
| 行为                          | `position: relative`          | `position: static`（默认）       |
|------------------------------|--------------------------------|---------------------------------|
| **是否创建定位上下文**         | ✅ 是                          | ❌ 否                           |
| **是否脱离文档流**            | ❌ 否（保持原位）               | ❌ 否                           |
| **子元素绝对定位的基准**       | 相对于父元素边界               | 相对于文档根元素或最近非 `static` 祖先 |

通过为父元素设置 `position: relative`，你确保了子元素的绝对定位始终相对于父容器，这是实现精准定位的核心技巧！
class MegaMenu {
  private el: HTMLDivElement | null = null;
  private megamenuParent: HTMLDivElement | null = null;
  private menuItems: NodeListOf<HTMLDivElement> | null = null;
  private menus: Array<MegaMenuItem> = [];

  constructor() {
    this.el = document.querySelector(".js-megamenu");
    if (!this.el) {
      return;
    }

    this.megamenuParent = this.el.querySelector(".mega-menu-sub-items");

    if (!this.megamenuParent) {
      return;
    }

    this.menuItems = this.megamenuParent.querySelectorAll(".megamenu-item");

    if (!this.menuItems) {
      return;
    }

    this.createMegamenuItems();
    this.bindEventListeners();
  }

  private createMegamenuItems = () => {
    Array.prototype.map.call(this.menuItems, (menuItem: HTMLDivElement) => {
      const megamenuInstance = new MegaMenuItem(
        menuItem,
        this.el,
        this.closeActiveMenu
      );
      this.menus.push(megamenuInstance);
    });
  };

  private bindEventListeners = () => {
    this.megamenuParent?.addEventListener("mouseleave", () => {
      this.closeActiveMenu();
    });

    this.megamenuParent?.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        this.closeActiveMenu();
      }
    });

    this.megamenuParent?.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowDown") {
        e.preventDefault();
      }
    });
  };

  private closeActiveMenu = () => {
    Array.prototype.map.call(
      this.menuItems,
      (menuItem: HTMLDivElement, index) => {
        if (!menuItem.classList.contains("megamenu-selected")) {
          return;
        }

        const itemId = menuItem.getAttribute("data-index");
        const megamenuClassString = `.mega-menu-subitems-root-${itemId}`;
        const targetPanel: HTMLDivElement | null | undefined =
          this.el?.querySelector(megamenuClassString);

        if (!targetPanel) {
          return;
        }
        targetPanel.style.display = "none";

        const targetLinkElement = menuItem.querySelector("a");
        targetLinkElement?.setAttribute("aria-expanded", "false");
        menuItem.classList.remove("megamenu-selected");

        this.menus[index].setExpanded(false);
      }
    );
  };
}

class MegaMenuItem {
  private root: HTMLDivElement | null = null;
  private el: HTMLDivElement | null = null;
  private itemIndex: string | null = null;
  private megamenuItemPanel: HTMLDivElement | null = null;
  private megamenuItemTrigger: HTMLAnchorElement | null = null;
  private closeActiveMenu;
  private megaMenuTimer: NodeJS.Timeout | null = null;
  private uiElements: Array<NodeListOf<HTMLAnchorElement>> = [];
  private curColumnIndex = 0;
  private curUIElementIndex = 0;
  private expanded = false;

  constructor(
    element: HTMLDivElement | null,
    root: HTMLDivElement | null,
    closeActiveMenu: () => void
  ) {
    if (!element || !root) {
      return;
    }

    this.el = element;
    this.root = root;
    this.itemIndex = this.el.getAttribute("data-index");
    const megamenuClassString = `.mega-menu-subitems-root-${this.itemIndex}`;
    this.megamenuItemPanel = this.root.querySelector(megamenuClassString);
    this.megamenuItemTrigger = this.el.querySelector(".megamenu-first-level");

    this.closeActiveMenu = closeActiveMenu;

    if (!this.megamenuItemPanel) {
      return;
    }

    this.mapSubMenuUIElements();
    this.bindListners();
    this.mapUIElementListeners();
  }

  private mapUIElementListeners = () => {
    if (!this.uiElements.length) {
      return;
    }

    this.uiElements.map((columnElements, colIndex) => {
      this.bindUIElementListeners(columnElements, colIndex);
    });
  };

  private bindUIElementListeners = (
    columnElements: NodeListOf<HTMLAnchorElement>,
    colIndex: number
  ) => {
    Array.prototype.map.call(
      columnElements,
      (uiELement: HTMLAnchorElement, UIIndex: number) => {
        this.addUiElementListener(uiELement, colIndex, UIIndex);
      }
    );
  };

  private addUiElementListener = (
    uiELement: HTMLAnchorElement,
    columnIndex: number,
    UIIndex: number
  ) => {
    uiELement.addEventListener("focus", (e) => {
      e.preventDefault();
      this.curColumnIndex = columnIndex;
      this.curUIElementIndex = UIIndex;
    });

    uiELement.addEventListener("keyup", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.incrementFocus();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        this.decrementFocus();
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        this.incrementColumnFocus();
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.decrementColumnFocus();
        return;
      }
    });

    uiELement.addEventListener("focusout", (e: any) => {
      if (
        !this.el?.contains(e.relatedTarget) &&
        !this.megamenuItemPanel?.contains(e.relatedTarget)
      ) {
        if (!this.closeActiveMenu) {
          return;
        }
        this.closeActiveMenu();
      }
    });
  };

  private mapSubMenuUIElements = () => {
    const panelColumns: NodeListOf<HTMLDivElement> | undefined =
      this.megamenuItemPanel?.querySelectorAll(".col-sub-menu");

    Array.prototype.map.call(panelColumns, (columnElement: HTMLDivElement) => {
      const columnUIELements: NodeListOf<HTMLAnchorElement> =
        columnElement.querySelectorAll("a");
      this.uiElements.push(columnUIELements);
    });
  };

  private bindListners = () => {
    this.el?.addEventListener("click", (e) => {
      e.preventDefault();
      this.expandMenu();
    });

    this.el?.addEventListener("mouseenter", this.debounceMenuOpen);

    this.el?.addEventListener("mouseleave", () => {
      this.clearMegaMenuTimer();
    });

    this.el?.addEventListener("keyup", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();

        if (!this.expanded) {
          this.expandMenu();
          return;
        }

        this.focusCurrentElement();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!this.closeActiveMenu) {
          return;
        }
        this.closeActiveMenu();
      }
    });

    this.el?.addEventListener("focusout", (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (
        !this.el?.contains(relatedTarget) &&
        !this.megamenuItemPanel?.contains(relatedTarget)
      ) {
        if (!this.closeActiveMenu) {
          return;
        }
        this.closeActiveMenu();
      }
    });
  };

  private incrementFocus = () => {
    // if elemnet is last in column and in last column
    if (
      this.uiElements.length === this.curColumnIndex + 1 &&
      this.uiElements[this.curColumnIndex].length === this.curUIElementIndex + 1
    ) {
      this.curColumnIndex = 0;
      this.curUIElementIndex = 0;
      this.megamenuItemTrigger?.focus();
      return;
    }
    //if element is last in column, and not last column
    if (
      this.uiElements[this.curColumnIndex].length ===
      this.curUIElementIndex + 1
    ) {
      this.curColumnIndex++;
      this.curUIElementIndex = 0;
      this.focusCurrentElement();
      return;
    }

    // all other elements
    this.curUIElementIndex++;
    this.focusCurrentElement();
  };

  private decrementFocus = () => {
    // if elemnet is first in first column
    if (this.curColumnIndex === 0 && this.curUIElementIndex === 0) {
      this.curColumnIndex = 0;
      this.curUIElementIndex = 0;
      this.megamenuItemTrigger?.focus();
      return;
    }
    //if element is first in column, and not first column
    if (this.curUIElementIndex === 0) {
      this.curColumnIndex--;
      this.curUIElementIndex = this.uiElements[this.curColumnIndex].length - 1;
      this.focusCurrentElement();
      return;
    }

    // all other elements
    this.curUIElementIndex--;
    this.focusCurrentElement();
  };

  private incrementColumnFocus = () => {
    if (this.uiElements.length === this.curColumnIndex + 1) {
      this.curColumnIndex = 0;
      this.curUIElementIndex = 0;
      this.megamenuItemTrigger?.focus();
      return;
    }

    this.curColumnIndex++;
    this.curUIElementIndex = 0;
    this.focusCurrentElement();
  };

  private decrementColumnFocus = () => {
    if (this.curColumnIndex === 0) {
      this.curColumnIndex = 0;
      this.curUIElementIndex = 0;
      this.megamenuItemTrigger?.focus();
      return;
    }

    this.curColumnIndex--;
    this.curUIElementIndex = 0;
    this.focusCurrentElement();
  };

  private focusCurrentElement = () => {
    const targetElement =
      this.uiElements[this.curColumnIndex][this.curUIElementIndex];
    targetElement.focus();
  };

  private debounceMenuOpen = () => {
    this.megaMenuTimer = setTimeout(() => {
      this.expandMenu();
    }, 500);
  };

  private clearMegaMenuTimer = () => {
    if (!this.megaMenuTimer) {
      return;
    }
    clearTimeout(this.megaMenuTimer);
  };

  private expandMenu = () => {
    if (!this.closeActiveMenu) {
      return;
    }
    this.closeActiveMenu();
    if (!this.megamenuItemPanel) {
      return;
    }
    this.megamenuItemPanel.style.display = "block";
    this.el?.classList.add("megamenu-selected");
    if (!this.megamenuItemTrigger) {
      return;
    }
    this.megamenuItemTrigger.setAttribute("aria-expanded", "true");
    this.setExpanded(true);
  };

  public setExpanded = (expanded: boolean) => {
    this.expanded = expanded;
  };
}

export { MegaMenu };

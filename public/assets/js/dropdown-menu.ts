const initDropdownMenu = () => {
  const dropdownTriggers = document.querySelectorAll(".dropdown-link");
  if (!dropdownTriggers.length) {
    return;
  }
  Array.prototype.map.call(dropdownTriggers, (element) => {
    new Dropdown(element);
  });
};

class Dropdown {
  private el: HTMLElement;
  private menu: HTMLElement | null = null;
  private menuId: string | null;
  private menuLinks;
  private parentLi;

  constructor(element: HTMLElement) {
    this.el = element;
    this.menuId = this.el.getAttribute("data-menu-id");
    if (this.menuId) {
      this.menu = document.getElementById(this.menuId);
    }
    this.menuLinks = this.menu?.querySelectorAll(".dropdown-nav__item");
    this.parentLi = this.menu?.closest("li");
    this.bindListeners();
  }

  private bindListeners() {
    this.el.addEventListener("click", this.handleMenuClick);
    this.el.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        this.openMenu();
      }
      if (e.key === "Escape") {
        this.closeMenu();
      }
    });

    this.parentLi?.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        this.closeMenu();
        this.el.focus();
      }
    });

    this.parentLi?.addEventListener("focusout", (e) => {
      const eventTarget = e.currentTarget as HTMLElement;
      const relatedTarget = e.relatedTarget as Node;

      if (!eventTarget?.contains(relatedTarget)) {
        this.closeMenu();
      }
    });

    Array.prototype.map.call(this.menuLinks, (element) => {
      element.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
          e.preventDefault();
        }
      });

      element.addEventListener("keyup", (e: KeyboardEvent) => {
        const eventTarget = e.target as HTMLElement;
        if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
          e.preventDefault();
          eventTarget.click();
        }
      });
    });
  }

  private handleMenuClick = (e: MouseEvent) => {
    e.preventDefault();
    this.openMenu();
  };

  private openMenu() {
    const isMenuAlreadyOpen = this.el.classList.contains("active");
    if (!isMenuAlreadyOpen) {
      hideOtherActiveMenuItems();
    }
    if (isMenuAlreadyOpen) {
      this.el.classList.remove("active");
      this.el.setAttribute("aria-expanded", "false");
    } else {
      this.el.classList.add("active");
      this.el.setAttribute("aria-expanded", "true");
    }
    // Get the heights of the menu items
    let menuHeight = 0;

    Array.prototype.map.call(this.menuLinks, (element) => {
      const linkHeight = element.getBoundingClientRect().height;
      menuHeight = menuHeight + linkHeight;
    });

    //Get the distance based on the link's current y position in the browser window

    const linkBounding = this.el.getBoundingClientRect();
    const linkYPos = linkBounding.top + linkBounding.height;
    const yDistanceToWindow = window.innerHeight - linkYPos;

    // If the link y position is less or equal to the height of the menu
    // ...we 'dropup' instead of dropdown
    if (menuHeight >= yDistanceToWindow) {
      if (!this.menu?.classList.contains("dropup")) {
        this.menu?.classList.add("dropup");
      }
    } else {
      this.menu?.classList.remove("dropup");
    }

    return this.menu?.classList.contains("active")
      ? this.menu?.classList.remove("active")
      : this.menu?.classList.add("active");
  }

  private closeMenu() {
    this.menu?.classList.remove("active");
    this.el.classList.remove("active");
  }
}

const hideOtherActiveMenuItems = () => {
  //$(".dropdown-nav.active, .dropdown-link.active").removeClass("active");
};

export default initDropdownMenu;

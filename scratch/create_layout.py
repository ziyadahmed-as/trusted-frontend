import re

html_snippet = """<div class="bg-white">
  <!-- Mobile menu -->
  <el-dialog>
    <dialog id="mobile-menu" class="backdrop:bg-transparent lg:hidden">
      <el-dialog-backdrop class="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"></el-dialog-backdrop>
      <div tabindex="0" class="fixed inset-0 flex focus:outline-none">
        <el-dialog-panel class="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full">
          <div class="flex px-4 pt-5 pb-2">
            <button type="button" command="close" commandfor="mobile-menu" class="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400">
              <span class="absolute -inset-0.5"></span>
              <span class="sr-only">Close menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6">
                <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <!-- Links -->
          <el-tab-group class="mt-2 block">
            <div class="border-b border-gray-200">
              <el-tab-list class="-mb-px flex space-x-8 px-4">
                <button class="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 aria-selected:border-indigo-600 aria-selected:text-indigo-600">Women</button>
                <button class="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 aria-selected:border-indigo-600 aria-selected:text-indigo-600">Men</button>
              </el-tab-list>
            </div>
            <el-tab-panels>
              <div class="space-y-10 px-4 pt-10 pb-8">
                <div class="grid grid-cols-2 gap-x-4">
                  <div class="group relative text-sm">
                    <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg" alt="Models sitting back to back, wearing Basic Tee in black and bone." class="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75" />
                    <a href="#" class="mt-6 block font-medium text-gray-900">
                      <span aria-hidden="true" class="absolute inset-0 z-10"></span>
                      New Arrivals
                    </a>
                    <p aria-hidden="true" class="mt-1">Shop now</p>
                  </div>
                  <div class="group relative text-sm">
                    <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg" alt="Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees." class="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75" />
                    <a href="#" class="mt-6 block font-medium text-gray-900">
                      <span aria-hidden="true" class="absolute inset-0 z-10"></span>
                      Basic Tees
                    </a>
                    <p aria-hidden="true" class="mt-1">Shop now</p>
                  </div>
                </div>
                <div>
                  <p id="women-clothing-heading-mobile" class="font-medium text-gray-900">Clothing</p>
                  <ul role="list" aria-labelledby="women-clothing-heading-mobile" class="mt-6 flex flex-col space-y-6">
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Tops</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Dresses</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Pants</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Denim</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Sweaters</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">T-Shirts</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Jackets</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Activewear</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Browse All</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p id="women-accessories-heading-mobile" class="font-medium text-gray-900">Accessories</p>
                  <ul role="list" aria-labelledby="women-accessories-heading-mobile" class="mt-6 flex flex-col space-y-6">
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Watches</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Wallets</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Bags</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Sunglasses</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Hats</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Belts</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p id="women-brands-heading-mobile" class="font-medium text-gray-900">Brands</p>
                  <ul role="list" aria-labelledby="women-brands-heading-mobile" class="mt-6 flex flex-col space-y-6">
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Full Nelson</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">My Way</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Re-Arranged</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Counterfeit</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Significant Other</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div hidden class="space-y-10 px-4 pt-10 pb-8">
                <div class="grid grid-cols-2 gap-x-4">
                  <div class="group relative text-sm">
                    <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg" alt="Drawstring top with elastic loop closure and textured interior padding." class="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75" />
                    <a href="#" class="mt-6 block font-medium text-gray-900">
                      <span aria-hidden="true" class="absolute inset-0 z-10"></span>
                      New Arrivals
                    </a>
                    <p aria-hidden="true" class="mt-1">Shop now</p>
                  </div>
                  <div class="group relative text-sm">
                    <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg" alt="Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt." class="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75" />
                    <a href="#" class="mt-6 block font-medium text-gray-900">
                      <span aria-hidden="true" class="absolute inset-0 z-10"></span>
                      Artwork Tees
                    </a>
                    <p aria-hidden="true" class="mt-1">Shop now</p>
                  </div>
                </div>
                <div>
                  <p id="men-clothing-heading-mobile" class="font-medium text-gray-900">Clothing</p>
                  <ul role="list" aria-labelledby="men-clothing-heading-mobile" class="mt-6 flex flex-col space-y-6">
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Tops</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Pants</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Sweaters</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">T-Shirts</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Jackets</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Activewear</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Browse All</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p id="men-accessories-heading-mobile" class="font-medium text-gray-900">Accessories</p>
                  <ul role="list" aria-labelledby="men-accessories-heading-mobile" class="mt-6 flex flex-col space-y-6">
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Watches</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Wallets</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Bags</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Sunglasses</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Hats</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Belts</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p id="men-brands-heading-mobile" class="font-medium text-gray-900">Brands</p>
                  <ul role="list" aria-labelledby="men-brands-heading-mobile" class="mt-6 flex flex-col space-y-6">
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Re-Arranged</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Counterfeit</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">Full Nelson</a>
                    </li>
                    <li class="flow-root">
                      <a href="#" class="-m-2 block p-2 text-gray-500">My Way</a>
                    </li>
                  </ul>
                </div>
              </div>
            </el-tab-panels>
          </el-tab-group>

          <div class="space-y-6 border-t border-gray-200 px-4 py-6">
            <div class="flow-root">
              <a href="#" class="-m-2 block p-2 font-medium text-gray-900">Company</a>
            </div>
            <div class="flow-root">
              <a href="#" class="-m-2 block p-2 font-medium text-gray-900">Stores</a>
            </div>
          </div>

          <div class="space-y-6 border-t border-gray-200 px-4 py-6">
            <div class="flow-root">
              <a href="#" class="-m-2 block p-2 font-medium text-gray-900">Sign in</a>
            </div>
            <div class="flow-root">
              <a href="#" class="-m-2 block p-2 font-medium text-gray-900">Create account</a>
            </div>
          </div>

          <div class="border-t border-gray-200 px-4 py-6">
            <a href="#" class="-m-2 flex items-center p-2">
              <img src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg" alt="" class="block h-auto w-5 shrink-0" />
              <span class="ml-3 block text-base font-medium text-gray-900">CAD</span>
              <span class="sr-only">, change currency</span>
            </a>
          </div>
        </el-dialog-panel>
      </div>
    </dialog>
  </el-dialog>

  <header class="relative bg-white z-50">
    <p class="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">Vendor Portal - Manage your business</p>

    <nav aria-label="Top" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="border-b border-gray-200">
        <div class="flex h-16 items-center">
          <button type="button" command="show-modal" commandfor="mobile-menu" class="relative rounded-md bg-white p-2 text-gray-400 lg:hidden">
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open menu</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6">
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <!-- Logo -->
          <div class="ml-4 flex lg:ml-0">
            <a href="#">
              <span class="sr-only">Your Company</span>
              <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" class="h-8 w-auto" />
            </a>
          </div>

          <!-- Flyout menus -->
          <el-popover-group class="group/popover-group hidden lg:ml-8 lg:block lg:self-stretch">
            <div class="flex h-full space-x-8">
              <div class="group/popover flex">
                <div class="relative flex">
                  <button popovertarget="desktop-menu-women" class="relative flex items-center justify-center text-sm font-medium transition-colors duration-200 ease-out group-not-has-open/popover:text-gray-700 group-has-open/popover:text-indigo-600 group-not-has-open/popover:hover:text-gray-800">
                    Products
                    <span aria-hidden="true" class="absolute inset-x-0 -bottom-px z-30 h-0.5 bg-transparent duration-200 ease-in group-has-open/popover:bg-indigo-600 group-has-open/popover-group:duration-150 group-has-open/popover-group:ease-out"></span>
                  </button>
                </div>
              </div>
              <div class="group/popover flex">
                <div class="relative flex">
                  <button popovertarget="desktop-menu-men" class="relative flex items-center justify-center text-sm font-medium transition-colors duration-200 ease-out group-not-has-open/popover:text-gray-700 group-has-open/popover:text-indigo-600 group-not-has-open/popover:hover:text-gray-800">
                    Orders
                    <span aria-hidden="true" class="absolute inset-x-0 -bottom-px z-30 h-0.5 bg-transparent duration-200 ease-in group-has-open/popover:bg-indigo-600 group-has-open/popover-group:duration-150 group-has-open/popover-group:ease-out"></span>
                  </button>
                </div>
              </div>

              <a href="#" class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">Finance</a>
              <a href="#" class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">Settings</a>
            </div>
          </el-popover-group>

          <div class="ml-auto flex items-center">
            
            <div class="hidden lg:ml-8 lg:flex">
              <a href="#" class="flex items-center text-gray-700 hover:text-gray-800">
                <img src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg" alt="" class="block h-auto w-5 shrink-0" />
                <span class="ml-3 block text-sm font-medium">CAD</span>
                <span class="sr-only">, change currency</span>
              </a>
            </div>

            <!-- Search -->
            <div class="flex lg:ml-6">
              <a href="#" class="p-2 text-gray-400 hover:text-gray-500">
                <span class="sr-only">Search</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6">
                  <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </div>

            <!-- Profile / Notify -->
            <div class="ml-4 flow-root lg:ml-6">
              <a href="#" class="group -m-2 flex items-center p-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 shrink-0 text-gray-400 group-hover:text-gray-500">
                  <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">3</span>
                <span class="sr-only">unread notifications</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</div>"""

html_snippet = re.sub(r'class="', r'className="', html_snippet)
# Convert stroke-width to strokeWidth, etc.
html_snippet = re.sub(r'stroke-width="', r'strokeWidth="', html_snippet)
html_snippet = re.sub(r'stroke-linecap="', r'strokeLinecap="', html_snippet)
html_snippet = re.sub(r'stroke-linejoin="', r'strokeLinejoin="', html_snippet)
html_snippet = re.sub(r'for="', r'htmlFor="', html_snippet)
# Ensure img has closing tag
html_snippet = re.sub(r'(<img[^>]+)(?<!/)>', r'\1 />', html_snippet)
# Ensure input has closing tag
html_snippet = re.sub(r'(<input[^>]+)(?<!/)>', r'\1 />', html_snippet)
# Some tags like aria-hidden are fine.

layout_code = f"""'use client';

import React, {{ useEffect }} from 'react';
import Link from 'next/link';
import {{ LayoutDashboard, Package, ShoppingCart, DollarSign, Settings, Bell, Search, Star }} from 'lucide-react';
import '@tailwindplus/elements';

export default function VendorProfileLayout({{ children }}: {{ children: React.ReactNode }}) {{
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {html_snippet}
      
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Left Sidebar for Vendor Tasks */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col py-8 px-4">
          <div className="mb-8 px-4">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Vendor Tasks</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Manage your storefront</p>
          </div>
          
          <nav className="space-y-2 flex-1">
            <Link href="/vendor-profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
              <LayoutDashboard className="w-5 h-5 text-gray-400" /> Dashboard
            </Link>
            <Link href="/vendor-profile/products" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
              <Package className="w-5 h-5 text-gray-400" /> Products
            </Link>
            <Link href="/vendor-profile/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-400" /> Orders
            </Link>
            <Link href="/vendor-profile/finance" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
              <DollarSign className="w-5 h-5 text-gray-400" /> Finance
            </Link>
            <Link href="/vendor-profile/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 text-gray-400" /> Settings
            </Link>
            <div className="pt-4 mt-4 border-t border-gray-100">
               <Link href="/seller-forum" className="flex items-center gap-3 px-4 py-3 text-sm font-bold justify-between text-indigo-600 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors">
                <span className="flex items-center gap-3"><Star className="w-5 h-5" /> Seller Hub</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full bg-transparent p-6 md:p-10 hide-scrollbar overflow-y-auto" style={{ maxHeight: 'calc(100vh - 104px)' }}>
          {{children}}
        </main>
      </div>
    </div>
  );
}}
"""

with open("scratch/layout_generator.py", "w") as f:
    f.write("layout_code = " + repr(layout_code) + "\\n" + 'with open("app/vendor-profile/layout.tsx", "w") as f: f.write(layout_code)')

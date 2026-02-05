           /* ----
           Create ring items
        ----*/
        function createRingItems(container, labels) {
            container.querySelectorAll(".item").forEach(el => el.remove());
            const count = labels.length;

            for (let i = 0; i < count; i++) {
                const el = document.createElement("div");
                el.className = "item";
                el.textContent = labels[i];
                container.appendChild(el);
            }

            placeRingItems(container);
        }

        /* -------------
           Position items around circle
        ---------------*/
        function placeRingItems(container) {
            const items = [...container.querySelectorAll(".item")];
            if (!items.length) return;

            const rect = container.getBoundingClientRect();
            const radius = Math.min(rect.width, rect.height) / 2 - 22;
            const step = 360 / items.length;

            items.forEach((it, i) => {
                const angle = i * step;
                it.style.transform = `
            translate(-50%, -50%)
            rotate(${angle}deg)
            translateY(-${radius}px)
            rotate(${-angle}deg)
        `;
            });
        }

        /* -----------------------------------------
           Rotate ring
        ------------------------------------------*/
        function rotateRingToIndex(container, index) {
            const items = [...container.querySelectorAll(".item")];
            const step = 360 / items.length;

            const angle = -(index * step);
            container.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

            items.forEach((it, idx) => it.classList.toggle("current", idx === index));
        }

        /* -----------------------------------------
           Clock setup
        ------------------------------------------*/
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const dates = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

        const datesRing = document.getElementById("datesRing");
        const monthsRing = document.getElementById("monthsRing");
        const daysRing = document.getElementById("daysRing");

        createRingItems(datesRing, dates);
        createRingItems(monthsRing, months);
        createRingItems(daysRing, days);

        window.addEventListener("resize", () => {
            placeRingItems(datesRing);
            placeRingItems(monthsRing);
            placeRingItems(daysRing);
        });

        /* -----------------------------------------
           Analog hands
        ------------------------------------------*/
        const hourHand = document.getElementById("hourHand");
        const minuteHand = document.getElementById("minuteHand");
        const secondHand = document.getElementById("secondHand");

        [hourHand, minuteHand, secondHand].forEach(h => {
            h.style.transition = "transform 0.5s cubic-bezier(.22,.9,.35,1)";
        });

        /* -----------------------------------------
           Highlight nearest item
        ------------------------------------------*/
        function highlightNearest(container) {
            const items = [...container.querySelectorAll(".item")];
            if (!items.length) return;

            const rect = container.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + 6; // target top

            let best = 0;
            let bestDist = Infinity;

            items.forEach((it, idx) => {
                const r = it.getBoundingClientRect();
                const x = r.left + r.width / 2;
                const y = r.top + r.height / 2;

                const d = (x - cx) ** 2 + (y - cy) ** 2;
                if (d < bestDist) { bestDist = d; best = idx; }
            });

            items.forEach((it, idx) =>
                it.classList.toggle("current", idx === best)
            );
        }

        /* -----------------------------------------
           Update clock
        ------------------------------------------*/
        function updateClock() {
            const now = new Date();
            const s = now.getSeconds();
            const m = now.getMinutes();
            const h = now.getHours();

            const sDeg = s * 6;
            const mDeg = m * 6 + s * 0.1;
            const hDeg = (h % 12) * 30 + m * 0.5 + s * (0.5 / 60);

            hourHand.style.transform = `translate(-50%, -50%) rotate(${hDeg}deg)`;
            minuteHand.style.transform = `translate(-50%, -50%) rotate(${mDeg}deg)`;
            secondHand.style.transform = `translate(-50%, -50%) rotate(${sDeg}deg)`;

            rotateRingToIndex(datesRing, now.getDate() - 1);
            rotateRingToIndex(monthsRing, now.getMonth());
            rotateRingToIndex(daysRing, now.getDay());

            highlightNearest(datesRing);
            highlightNearest(monthsRing);
            highlightNearest(daysRing);
        }

        window.onload = () => {
            document.getElementById("wrap").classList.add("ready");
            updateClock();
            setInterval(updateClock, 1000);
        };
    